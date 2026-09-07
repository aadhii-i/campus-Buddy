import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Upload, FileText, Download, Check, AlertCircle, Star, TrendingUp, Target,
  Briefcase, Compass, Info, Sparkles, ShieldCheck, LayoutGrid, Code2,
  FolderGit2, Award, Hash, PenLine, ChevronDown, X, Zap
} from 'lucide-react';
import { generateReport } from "../utils/generateReport";
import { resumeService } from '../services/resumeService';
import ResumeChat from '../components/ResumeChat';
import CircularProgress from '../components/home/CircularProgress';
import AnimatedCounter from '../components/home/AnimatedCounter';
import { Badge } from '../components/common';

const TARGET_ROLES = [
  'Software Engineer',
  'Full Stack Developer',
  'Backend Developer',
  'Data Scientist',
  'Machine Learning Engineer',
  'Data Analyst'
];

// Category keys returned by the AI analyzer -> icon + accent for the dashboard.
const CATEGORY_META = {
  atsCompatibility: { icon: ShieldCheck, color: 'text-brand-600', bg: 'bg-brand-50' },
  structure: { icon: LayoutGrid, color: 'text-violet-600', bg: 'bg-violet-50' },
  skillsMatch: { icon: Code2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  projects: { icon: FolderGit2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  experience: { icon: Briefcase, color: 'text-amber-600', bg: 'bg-amber-50' },
  achievements: { icon: Award, color: 'text-pink-600', bg: 'bg-pink-50' },
  keywordMatch: { icon: Hash, color: 'text-glow-600', bg: 'bg-glow-500/10' },
  writingQuality: { icon: PenLine, color: 'text-rose-600', bg: 'bg-rose-50' },
};

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [chatSessionId, setChatSessionId] = useState(null);
  const [expandedRec, setExpandedRec] = useState(0);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    }
  };

  const analyzeResume = async () => {
    if (!file || !targetRole) return;

    setAnalyzing(true);

    try {
      // Save the resume to the AI service (no eager chat indexing — that path
      // is heavy and unreliable on a small dyno; the chat below indexes on
      // demand from the same sessionId when the user first asks a question).
      const { sessionId } = await resumeService.uploadForAnalysis(file);
      setChatSessionId(sessionId);

      // Real, role-aware AI analysis — never hardcoded, varies per resume and per role.
      const result = await resumeService.analyzeResume(sessionId, targetRole);
      setAnalysis(result);
    } catch (error) {
      // Single, specific message for the whole flow (upload + analyze). The API
      // layer is `silent` for these calls, so this is the only toast — except a
      // 401, which the api interceptor already reports ("please log in").
      const status = error.response?.status;
      const serverMessage = error.response?.data?.message;
      const requestId = error.response?.data?.requestId;
      console.error(
        `Resume analysis failed${requestId ? ` [${requestId}]` : ''}:`,
        status,
        serverMessage || error.message
      );

      if (status === 401) return; // handled by the api interceptor

      const timedOut = error.code === 'ECONNABORTED' || /timeout/i.test(error.message || '');

      let message = serverMessage;
      if (!message) {
        if (status === 429) message = 'The server is busy right now. Please wait a minute and try again.';
        else if (timedOut) message = 'The analysis is taking longer than usual (the AI service may be waking up). Please try again in a moment.';
        else if (!error.response) message = 'Cannot reach the server. Check your connection and try again.';
        else message = 'Could not analyze your resume right now. Please try again.';
      }
      toast.error(message);
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreTone = (score) => {
    if (score >= 80) return { text: 'text-emerald-600', ring: '#059669', chip: 'bg-emerald-50 text-emerald-700' };
    if (score >= 60) return { text: 'text-amber-600', ring: '#d97706', chip: 'bg-amber-50 text-amber-700' };
    return { text: 'text-rose-600', ring: '#e11d48', chip: 'bg-rose-50 text-rose-700' };
  };

  const resetAnalysis = () => {
    setFile(null);
    setAnalysis(null);
    setAnalyzing(false);
    setChatSessionId(null);
  };

  return (
    <div className="min-h-screen bg-surface-50 pb-24 pt-28">
      {!analysis ? (
        <>
          {/* AI product hero */}
          <section className="relative mx-4 overflow-hidden rounded-[2rem] bg-midnight-950 sm:mx-6 lg:mx-8">
            <div className="pointer-events-none absolute inset-0 bg-mesh-dark" />
            <div className="pointer-events-none absolute inset-0 bg-noise" />
            <div className="relative mx-auto max-w-3xl px-6 py-16 text-center sm:py-20">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <span className="eyebrow !text-glow-400">
                  <Sparkles className="h-3 w-3" /> AI resume intelligence
                </span>
                <h1 className="text-display mt-4 text-3xl leading-[1.1] text-white sm:text-5xl">
                  Turn your resume into your
                  <span className="text-gradient-brand"> competitive advantage.</span>
                </h1>
                <p className="mx-auto mt-5 max-w-xl text-base text-white/60 sm:text-lg">
                  Upload once — get a role-aware ATS score, keyword gaps, and specific
                  rewrite suggestions, powered by Gemini and grounded only in your resume.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Upload experience */}
          <div className="mx-auto mt-10 max-w-2xl px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="surface-panel p-6 sm:p-8"
            >
              <label className="form-label">
                <Briefcase className="mr-1.5 -mt-0.5 inline h-3.5 w-3.5" />
                Target role <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="form-select"
                >
                  <option value="">Select the role you're targeting…</option>
                  {TARGET_ROLES.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-midnight-400" />
              </div>
              <p className="mt-1.5 text-xs text-midnight-400">
                Your resume is scored specifically against this role's expected skills and keywords.
              </p>

              <div
                className={`relative mt-6 overflow-hidden rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300 ${
                  dragActive
                    ? 'scale-[1.01] border-brand-400 bg-brand-50/60'
                    : file
                    ? 'border-emerald-300 bg-emerald-50/40'
                    : 'border-midnight-200 hover:border-brand-300 hover:bg-brand-50/30'
                }`}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={() => setDragActive(true)}
                onDragLeave={() => setDragActive(false)}
              >
                {file ? (
                  <div className="space-y-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                      <FileText className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="flex items-center justify-center gap-2 text-base font-semibold text-midnight-900">
                        {file.name}
                        <button
                          onClick={(e) => { e.stopPropagation(); setFile(null); }}
                          aria-label="Remove file"
                          className="rounded-full p-0.5 text-midnight-400 hover:bg-midnight-100 hover:text-midnight-700"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </p>
                      <p className="text-sm text-midnight-400">{(file.size / 1024 / 1024).toFixed(2)} MB · ready to analyze</p>
                    </div>
                    <button
                      onClick={analyzeResume}
                      disabled={analyzing || !targetRole}
                      title={!targetRole ? 'Select a target role first' : undefined}
                      className="btn-primary mx-auto !px-7 !py-3"
                    >
                      {analyzing ? (
                        <>
                          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-r-transparent" />
                          Analyzing your resume…
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4" />
                          Analyze resume
                        </>
                      )}
                    </button>
                    {!targetRole && (
                      <p className="text-sm text-amber-600">Select a target role above to enable analysis.</p>
                    )}
                    {analyzing && (
                      <p className="text-xs text-midnight-400">This can take up to a minute — Gemini is reading your whole resume.</p>
                    )}
                  </div>
                ) : (
                  <label className="block cursor-pointer space-y-4">
                    <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
                    <motion.div
                      animate={dragActive ? { y: -4 } : { y: 0 }}
                      className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600"
                    >
                      <Upload className="h-7 w-7" />
                    </motion.div>
                    <div>
                      <p className="text-base font-semibold text-midnight-900">
                        {dragActive ? 'Drop it right here' : 'Upload your resume'}
                      </p>
                      <p className="text-sm text-midnight-400">Drag and drop a PDF, or click to browse</p>
                    </div>
                    <span className="btn-secondary inline-flex !px-5 !py-2">Choose file</span>
                    <p className="text-xs text-midnight-400">PDF only · Max 10MB</p>
                  </label>
                )}
              </div>
            </motion.div>

            {/* What you get */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { icon: Target, title: 'ATS optimization', desc: 'See exactly how parsers and recruiters will read your resume.' },
                { icon: TrendingUp, title: 'Actionable fixes', desc: 'Specific, prioritized suggestions — not generic advice.' },
                { icon: Sparkles, title: 'Role-aware scoring', desc: 'Scored against the real skills your target role expects.' },
              ].map((f) => (
                <div key={f.title} className="rounded-2xl border border-midnight-100 bg-white p-5 text-center">
                  <f.icon className="mx-auto mb-3 h-6 w-6 text-brand-600" />
                  <h3 className="mb-1 text-sm font-semibold text-midnight-900">{f.title}</h3>
                  <p className="text-xs leading-relaxed text-midnight-500">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* ============================ AI Dashboard ============================ */
        <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6 lg:px-8">
          {/* Score hero */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="surface-panel-dark relative overflow-hidden p-6 sm:p-8">
            <div className="pointer-events-none absolute inset-0 bg-mesh-dark opacity-80" />
            <div className="pointer-events-none absolute inset-0 bg-noise" />
            <div className="relative flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col items-center gap-6 sm:flex-row">
                <CircularProgress percentage={analysis.overallScore} size={128} strokeWidth={9} color="#8b78fb" trackColor="rgba(255,255,255,0.12)">
                  <div className="text-center">
                    <p className="font-display text-3xl font-bold text-white">
                      <AnimatedCounter value={analysis.overallScore} duration={1.2} />
                    </p>
                    <p className="text-[10px] uppercase tracking-wide text-white/50">/ 100</p>
                  </div>
                </CircularProgress>
                <div className="text-center sm:text-left">
                  <span className="eyebrow !text-glow-400">Resume analysis complete</span>
                  <h1 className="text-display mt-1 text-2xl text-white">Overall score: {analysis.overallScore}</h1>
                  <p className="mt-1 text-sm text-white/60">
                    Target role · <span className="font-semibold text-white">{analysis.targetRole}</span>
                  </p>
                  {analysis.careerReadiness && (
                    <div className="mt-3 flex max-w-md items-start gap-2 rounded-xl bg-white/[0.07] p-3 text-left">
                      <Compass className="mt-0.5 h-4 w-4 flex-shrink-0 text-glow-400" />
                      <p className="text-xs leading-relaxed text-white/70">{analysis.careerReadiness}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-shrink-0 gap-2.5">
                <button onClick={resetAnalysis} className="btn-secondary !bg-white/10 !text-white hover:!bg-white/15">
                  New resume
                </button>
                <button
                  onClick={() => generateReport(analysis, file?.name || "Resume")}
                  className="btn-primary"
                >
                  <Download className="h-4 w-4" />
                  Report
                </button>
              </div>
            </div>

            {analysis.resumeSummary && (
              <p className="relative mt-6 max-w-3xl border-t border-white/10 pt-5 text-sm leading-relaxed text-white/60">
                {analysis.resumeSummary}
              </p>
            )}
          </motion.div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            {/* Category Analysis */}
            <div className="surface-panel p-6 lg:col-span-3">
              <h3 className="mb-5 text-base font-bold text-midnight-900">Category analysis</h3>
              <div className="space-y-4">
                {Object.entries(analysis.categoryScores).map(([key, data], i) => {
                  const percent = Math.round((data.score / data.max) * 100);
                  const meta = CATEGORY_META[key] || { icon: Star, color: 'text-brand-600', bg: 'bg-brand-50' };
                  const Icon = meta.icon;
                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      title={data.explanation}
                      className="group"
                    >
                      <div className="mb-1.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg ${meta.bg} ${meta.color}`}>
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-sm font-medium text-midnight-700">{data.label}</span>
                        </div>
                        <span className="flex-shrink-0 text-sm font-semibold text-midnight-500">
                          {data.score}<span className="text-midnight-300">/{data.max}</span>
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-midnight-100">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.04 }}
                          className={`h-full rounded-full ${
                            percent >= 80 ? 'bg-emerald-500' : percent >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                        />
                      </div>
                      {data.explanation && (
                        <p className="mt-1 pl-9 text-xs text-midnight-400 line-clamp-1 group-hover:line-clamp-none">{data.explanation}</p>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* ATS + keywords */}
            <div className="surface-panel p-6 lg:col-span-2">
              <h3 className="mb-5 text-base font-bold text-midnight-900">ATS compatibility</h3>
              <div className="mb-6 flex items-center gap-5">
                <CircularProgress percentage={analysis.atsScore} size={84} strokeWidth={7} color={getScoreTone(analysis.atsScore).ring} trackColor="#e4e6f0">
                  <span className={`text-lg font-bold ${getScoreTone(analysis.atsScore).text}`}>{analysis.atsScore}%</span>
                </CircularProgress>
                <div>
                  <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${getScoreTone(analysis.atsScore).chip}`}>
                    {analysis.atsScore >= 80 ? 'Strong match' : analysis.atsScore >= 60 ? 'Good match' : 'Needs work'}
                  </span>
                  <p className="mt-1.5 text-xs text-midnight-400">How well parsers can read this resume.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-midnight-500">
                    <Check className="h-3.5 w-3.5 text-emerald-500" /> Found keywords
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.foundKeywords.length > 0 ? analysis.foundKeywords.map((k, i) => (
                      <Badge key={i} variant="success">{k}</Badge>
                    )) : <p className="text-xs text-midnight-400">None detected.</p>}
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-midnight-500">
                    <X className="h-3.5 w-3.5 text-rose-500" /> Missing keywords
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.missingKeywords.length > 0 ? analysis.missingKeywords.map((k, i) => (
                      <Badge key={i} variant="danger">{k}</Badge>
                    )) : <p className="text-xs text-midnight-400">None — great coverage.</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Strengths / Weaknesses */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="surface-panel p-6">
              <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-midnight-900">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <Check className="h-4 w-4" />
                </div>
                Key strengths
              </h3>
              <ul className="space-y-3">
                {analysis.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-midnight-600">
                    <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            <div className="surface-panel p-6">
              <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-midnight-900">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  <AlertCircle className="h-4 w-4" />
                </div>
                Areas to improve
              </h3>
              <ul className="space-y-3">
                {analysis.weaknesses.map((improvement, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-midnight-600">
                    <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* AI Recommendations — expandable */}
          <div className="surface-panel p-6">
            <h3 className="mb-5 flex items-center gap-2 text-base font-bold text-midnight-900">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <Sparkles className="h-4 w-4" />
              </div>
              AI recommendations
            </h3>
            <div className="space-y-2.5">
              {analysis.recommendations.map((rec, index) => {
                const open = expandedRec === index;
                return (
                  <div key={index} className="overflow-hidden rounded-xl border border-midnight-100">
                    <button
                      onClick={() => setExpandedRec(open ? -1 : index)}
                      className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors hover:bg-midnight-50/60"
                    >
                      <span className="flex items-center gap-3">
                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-600">
                          {index + 1}
                        </span>
                        <span className="font-medium text-midnight-800">{rec.title}</span>
                      </span>
                      <ChevronDown className={`h-4 w-4 flex-shrink-0 text-midnight-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pl-13">
                            <p className="text-sm leading-relaxed text-midnight-600">{rec.description}</p>
                            {rec.category && (
                              <span className="mt-3 inline-block rounded-full bg-midnight-100 px-2.5 py-1 text-[11px] font-semibold text-midnight-600">
                                {analysis.categoryScores[rec.category]?.label || rec.category}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Suggested Improvements + Missing Info */}
          {(analysis.suggestedImprovements?.length > 0 || analysis.missingInformation?.length > 0) && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {analysis.suggestedImprovements?.length > 0 && (
                <div className="surface-panel p-6">
                  <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-midnight-900">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                    Suggested improvements
                  </h3>
                  <ul className="space-y-3">
                    {analysis.suggestedImprovements.map((item, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm text-midnight-600">
                        <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.missingInformation?.length > 0 && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-6">
                  <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-amber-900">
                    <Info className="h-5 w-5 text-amber-600" />
                    Missing information
                  </h3>
                  <ul className="space-y-2.5">
                    {analysis.missingInformation.map((item, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm text-amber-800">
                        <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* AI Chat Assistant */}
          <ResumeChat sessionId={chatSessionId} />
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;
