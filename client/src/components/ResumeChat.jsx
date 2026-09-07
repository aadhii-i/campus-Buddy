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
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
          isUser ? 'bg-brand-600' : 'bg-midnight-900'
        }`}
      >
        {isUser ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-glow-400" />}
      </div>

      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'rounded-tr-sm bg-brand-600 text-white'
            : 'rounded-tl-sm bg-midnight-50 text-midnight-800'
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
              strong: ({ children }) => <strong className="font-semibold text-midnight-900">{children}</strong>,
              h1: ({ children }) => <h4 className="mb-1 mt-2 font-semibold text-midnight-900">{children}</h4>,
              h2: ({ children }) => <h4 className="mb-1 mt-2 font-semibold text-midnight-900">{children}</h4>,
              h3: ({ children }) => <h4 className="mb-1 mt-2 font-semibold text-midnight-900">{children}</h4>,
              a: ({ children, href }) => (
                <a href={href} target="_blank" rel="noreferrer" className="text-brand-700 underline">
                  {children}
                </a>
              ),
              code: ({ inline, children, ...props }) =>
                inline ? (
                  <code className="rounded bg-midnight-100 px-1 py-0.5 text-xs" {...props}>
                    {children}
                  </code>
                ) : (
                  <pre className="my-1.5 overflow-x-auto rounded-lg bg-midnight-900 p-3 text-xs text-white">
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
    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-midnight-900">
      <Bot className="h-4 w-4 text-glow-400" />
    </div>
    <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-midnight-50 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-midnight-300"
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
    <div className="surface-panel overflow-hidden !p-0">
      <div className="flex items-center gap-3 border-b border-midnight-100 bg-midnight-950 px-6 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600">
          <Sparkles className="h-4.5 w-4.5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-white">Resume AI Assistant</h3>
          <p className="text-xs text-white/40">Answers are grounded only in your uploaded resume</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-glow-400">
          <span className="h-1.5 w-1.5 rounded-full bg-glow-400" />
          Live
        </span>
      </div>

      <div ref={scrollRef} className="max-h-96 space-y-4 overflow-y-auto px-6 py-5">
        {messages.length === 0 ? (
          <div>
            <p className="mb-3 text-sm text-midnight-400">
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
                    className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700 transition-colors hover:bg-brand-100"
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

      <div className="border-t border-midnight-100 bg-surface-50/60 px-6 py-4">
        <div className="flex items-end gap-3">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={
              disabled
                ? 'Analyze a resume to start chatting…'
                : 'Ask anything about your uploaded resume…'
            }
            className="form-input flex-1 resize-none disabled:cursor-not-allowed disabled:bg-midnight-50"
          />
          <button
            onClick={() => sendQuestion(input)}
            disabled={disabled || loading || !input.trim()}
            className="btn-primary flex-shrink-0 !px-5 !py-2.5"
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
