import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Bot, Send, Sparkles, User } from 'lucide-react';
import { resumeService } from '../services/resumeService';

const EXAMPLE_QUESTIONS = [
  'Summarize my resume',
  'What are my strongest skills?',
  'Which projects are the strongest?',
  'Which technologies am I missing?',
  'What internships suit me?',
  'Suggest improvements',
  'Rewrite my summary',
  'Which company matches my profile?'
];

// Renders one chat bubble, AI answers as markdown (with code block support),
// user questions as plain text.
const ChatBubble = ({ role, content }) => {
  const isUser = role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-blue-600' : 'bg-gray-900'
        }`}
      >
        {isUser ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-white" />}
      </div>

      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-blue-600 text-white rounded-tr-sm'
            : 'bg-gray-100 text-gray-800 rounded-tl-sm'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{content}</p>
        ) : (
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="my-1.5 first:mt-0 last:mb-0">{children}</p>,
              ul: ({ children }) => <ul className="my-1.5 pl-4 list-disc space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="my-1.5 pl-4 list-decimal space-y-1">{children}</ol>,
              li: ({ children }) => <li>{children}</li>,
              strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
              h1: ({ children }) => <h4 className="font-semibold text-gray-900 mt-2 mb-1">{children}</h4>,
              h2: ({ children }) => <h4 className="font-semibold text-gray-900 mt-2 mb-1">{children}</h4>,
              h3: ({ children }) => <h4 className="font-semibold text-gray-900 mt-2 mb-1">{children}</h4>,
              a: ({ children, href }) => (
                <a href={href} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                  {children}
                </a>
              ),
              code: ({ inline, children, ...props }) =>
                inline ? (
                  <code className="bg-gray-200 rounded px-1 py-0.5 text-xs" {...props}>
                    {children}
                  </code>
                ) : (
                  <pre className="bg-gray-900 text-gray-100 rounded-lg p-3 my-1.5 overflow-x-auto text-xs">
                    <code {...props}>{children}</code>
                  </pre>
                )
            }}
          >
            {content}
          </ReactMarkdown>
        )}
      </div>
    </motion.div>
  );
};

const TypingIndicator = () => (
  <div className="flex items-center gap-3">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center">
      <Bot className="h-4 w-4 text-white" />
    </div>
    <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  </div>
);

// Self-contained AI chat card for the Resume Analyzer page. Purely additive:
// it never touches the existing ATS analysis or report-download flow, and
// degrades gracefully (disabled input + helper text) when no resume has
// been indexed yet or the AI service is unreachable.
const ResumeChat = ({ sessionId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const sendQuestion = async (question) => {
    const trimmed = question.trim();
    if (!trimmed || loading || !sessionId) return;

    setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
    setInput('');
    setLoading(true);

    try {
      const answer = await resumeService.askResumeQuestion(sessionId, trimmed);
      setMessages((prev) => [...prev, { role: 'ai', content: answer }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'ai', content: error.message || "I couldn't find this information in your uploaded resume." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendQuestion(input);
    }
  };

  const disabled = !sessionId;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Ask AI About Your Resume</h3>
          <p className="text-xs text-gray-500">Answers are grounded only in your uploaded resume</p>
        </div>
      </div>

      <div ref={scrollRef} className="px-6 py-4 space-y-4 max-h-96 overflow-y-auto">
        {messages.length === 0 ? (
          <div>
            <p className="text-sm text-gray-500 mb-3">
              {disabled
                ? 'Analyze a resume above to unlock the AI assistant.'
                : 'Try asking one of these:'}
            </p>
            {!disabled && (
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendQuestion(q)}
                    className="text-xs px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <ChatBubble key={index} role={message.role} content={message.content} />
            ))}
          </AnimatePresence>
        )}
        {loading && <TypingIndicator />}
      </div>

      <div className="px-6 py-4 border-t border-gray-100">
        <div className="flex items-end gap-3">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={
              disabled
                ? 'Analyze a resume to start chatting...'
                : 'Ask anything about your uploaded resume...'
            }
            className="flex-1 resize-none px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
          />
          <button
            onClick={() => sendQuestion(input)}
            disabled={disabled || loading || !input.trim()}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 flex-shrink-0"
          >
            <Send className="h-4 w-4" />
            Ask
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeChat;
