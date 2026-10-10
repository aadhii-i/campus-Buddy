import React, { useRef, useState } from 'react';
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
  // Palette-only accents: lilac tiles for analysis categories, lime for the
  // keyword/ATS signals, ink for the "hard skills" ones.
  atsCompatibility: { icon: ShieldCheck, color: 'text-midnight-900', bg: 'bg-glow-400 border border-midnight-900/10' },
  structure: { icon: LayoutGrid, color: 'text-midnight-900', bg: 'bg-brand-200 border border-midnight-900/10' },
  skillsMatch: { icon: Code2, color: 'text-glow-400', bg: 'bg-midnight-900' },
  projects: { icon: FolderGit2, color: 'text-midnight-900', bg: 'bg-brand-200 border border-midnight-900/10' },
  experience: { icon: Briefcase, color: 'text-glow-400', bg: 'bg-midnight-900' },
  achievements: { icon: Award, color: 'text-midnight-900', bg: 'bg-brand-200 border border-midnight-900/10' },
  keywordMatch: { icon: Hash, color: 'text-midnight-900', bg: 'bg-glow-400 border border-midnight-900/10' },
  writingQuality: { icon: PenLine, color: 'text-midnight-900', bg: 'bg-brand-200 border border-midnight-900/10' },
};

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [chatSessionId, setChatSessionId] = useState(null);
  const [expandedRec, setExpandedRec] = useState(0);
  // Synchronous in-flight guard: `analyzing` state alone has a re-render gap
  // (a rapid double-click can fire this handler twice before `disabled`
  // takes effect). A ref updates in the same tick as the click, so the
  // second invocation — even microseconds later — sees it immediately and
  // bails out before creating a second upload+analyze request.
  const analyzeInFlightRef = useRef(false);

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
    // One click = one analysis job. This check+set happens synchronously, in
    // the same tick as the click — unlike the `analyzing` state (which only
    // disables the button after a re-render), so a rapid double-click or a
    // duplicate event firing can never start a second upload+analyze request.
    if (analyzeInFlightRef.current) return;
    analyzeInFlightRef.current = true;

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
      const code = error.response?.data?.code;
      const serverMessage = error.response?.data?.message;
      const requestId = error.response?.data?.requestId;
      console.error(
        `Resume analysis failed${requestId ? ` [${requestId}]` : ''}: status=${status} code=${code || 'n/a'}`,
        serverMessage || error.message
      );

      if (status === 401) return; // handled by the api interceptor

      const timedOut = error.code === 'ECONNABORTED' || /timeout/i.test(error.message || '');

      // Never auto-retry here — one clear message, button re-enables below,
      // the user decides whether to click Analyze again.
      let message = serverMessage;
      if (!message) {
        if (status === 429) message = 'AI analysis is temporarily rate limited. Please wait a moment before trying again.';
        else if (timedOut) message = 'The analysis is taking longer than usual (the AI service may be waking up). Please try again in a moment.';
        else if (!error.response) message = 'Cannot reach the server. Check your connection and try again.';
        else message = 'Could not analyze your resume right now. Please try again.';
      }
      toast.error(message);
    } finally {
      analyzeInFlightRef.current = false;
      setAnalyzing(false);
    }
  };

  const getScoreTone = (score) => {
    // Same thresholds; palette mapping: good = ink on lime, ok = lilac, poor = rose.
    if (score >= 80) return { text: 'text-midnight-900', ring: '#1A1A1A', chip: 'border border-midnight-900 bg-glow-400 text-midnight-900' };
    if (score >= 60) return { text: 'text-midnight-900', ring: '#8F75DC', chip: 'border border-midnight-900/15 bg-brand-200 text-midnight-900' };
    return { text: 'text-rose-700', ring: '#BE123C', chip: 'border border-rose-200 bg-rose-50 text-rose-800' };
  };

  const resetAnalysis = () => {
    setFile(null);
    setAnalysis(null);
    setAnalyzing(false);
    setChatSessionId(null);
  };

  return (
    <div className="page-shell">
      {!analysis ? (
        <>
          {/* AI product hero — cream, dot texture, ink type */}
          <section className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-dots mask-fade-b" />
            <div className="relative mx-auto max-w-3xl px-4 pb-4 pt-4 text-center sm:px-6 sm:pt-8">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <span className="eyebrow">
                  <Sparkles className="h-3 w-3" /> AI resume intelligence
                </span>
                <h1 className="text-display mt-5 text-3xl leading-[1.1] text-midnight-900 sm:text-5xl">
                  Turn your resume into your
                  <span className="marker"> competitive advantage.</span>
                </h1>
                <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-midnight-600 sm:text-lg">
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
              {/* Step 1 — role */}
              <div className="mb-4 flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-midnight-900 text-[11px] font-bold text-surface-50" aria-hidden="true">1</span>
                <span className="text-sm font-semibold text-midnight-900">Choose your target role</span>
              </div>
              <label htmlFor="resume-target-role" className="form-label">
                <Briefcase className="mr-1.5 -mt-0.5 inline h-3.5 w-3.5" aria-hidden="true" />
                Target role <span className="text-rose-700" aria-hidden="true">*</span>
              </label>
              <select
                id="resume-target-role"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="form-select"
                aria-required="true"
                aria-describedby="resume-target-role-hint"
              >
                <option value="">Select the role you're targeting…</option>
                {TARGET_ROLES.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              <p id="resume-target-role-hint" className="mt-1.5 text-xs text-midnight-500">
                Your resume is scored specifically against this role's expected skills and keywords.
              </p>

              {/* Step 2 — upload */}
              <div className="mb-4 mt-8 flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-midnight-900 text-[11px] font-bold text-surface-50" aria-hidden="true">2</span>
                <span className="text-sm font-semibold text-midnight-900">Upload your resume</span>
              </div>
              <div
                className={`relative overflow-hidden rounded-2xl border-2 p-8 text-center transition-all duration-300 ${
                  dragActive
                    ? 'scale-[1.01] border-dashed border-midnight-900 bg-brand-100'
                    : file
                    ? 'border-solid border-midnight-900/15 bg-surface-50/60'
                    : 'border-dashed border-midnight-900/20 bg-surface-50/40 focus-within:border-midnight-900 hover:border-midnight-900/40 hover:bg-surface-50'
                }`}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={() => setDragActive(true)}
                onDragLeave={() => setDragActive(false)}
              >
                {file ? (
                  <div className="space-y-5">
                    {/* Selected file card */}
                    <div className="mx-auto flex max-w-md items-center gap-3 rounded-xl border border-midnight-900/10 bg-surface-0 p-3 text-left">
                      <div className="icon-tile-lime h-11 w-11">
                        <FileText className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-midnight-900" title={file.name}>{file.name}</p>
                        <p className="text-xs text-midnight-500">{(file.size / 1024 / 1024).toFixed(2)} MB · ready to analyze</p>
                      </div>
                      <span className="badge-lime hidden sm:inline-flex">
                        <Check className="h-3 w-3" aria-hidden="true" /> PDF
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); setFile(null); }}
                        aria-label="Remove file"
                        className="btn-icon !h-8 !w-8 flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={analyzeResume}
                      disabled={analyzing || !targetRole}
                      title={!targetRole ? 'Select a target role first' : undefined}
                      className="btn-primary mx-auto !px-7 !py-3"
                    >
                      {analyzing ? (
                        <>
                          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-surface-50 border-r-transparent" aria-hidden="true" />
                          Analyzing your resume…
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4" aria-hidden="true" />
                          Analyze resume
                        </>
                      )}
                    </button>
                    {!targetRole && (
                      <p className="flex items-center justify-center gap-1.5 text-sm font-medium text-amber-800">
                        <Info className="h-4 w-4" aria-hidden="true" />
                        Select a target role above to enable analysis.
                      </p>
                    )}
                    {analyzing && (
                      <div
                        role="status"
                        aria-live="polite"
                        className="mx-auto flex max-w-md items-center gap-3 rounded-xl border border-midnight-900/10 bg-brand-100 px-4 py-3 text-left"
                      >
                        <div className="icon-tile-dark h-8 w-8 !rounded-lg">
                          <Sparkles className="h-4 w-4 animate-pulse" aria-hidden="true" />
                        </div>
                        <p className="text-xs leading-relaxed text-midnight-700">This can take up to a minute — Gemini is reading your whole resume.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <label className="block cursor-pointer space-y-4">
                    <input type="file" accept=".pdf" onChange={handleFileChange} className="sr-only" />
                    <motion.div
                      animate={dragActive ? { y: -4 } : { y: 0 }}
                      className={`mx-auto h-16 w-16 !rounded-2xl ${dragActive ? 'icon-tile-dark' : 'icon-tile'}`}
                    >
                      <Upload className="h-7 w-7" aria-hidden="true" />
                    </motion.div>
                    <div>
                      <p className="text-base font-semibold text-midnight-900">
                        {dragActive ? 'Drop it right here' : 'Upload your resume'}
                      </p>
                      <p className="text-sm text-midnight-500">Drag and drop a PDF, or click to browse</p>
                    </div>
                    <span className="btn-secondary inline-flex !px-5 !py-2">Choose file</span>
                    <p className="text-xs text-midnight-500">PDF only · Max 10MB</p>
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
                <div key={f.title} className="surface-panel p-5">
                  <div className="icon-tile mb-3 h-10 w-10">
                    <f.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
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
          {/* Score hero — ink panel, lime score ring */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="surface-panel-dark relative overflow-hidden p-6 sm:p-8">
            <div className="pointer-events-none absolute inset-0 bg-dots-dark mask-fade-b" />
            <div className="relative flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col items-center gap-6 sm:flex-row">
                <CircularProgress percentage={analysis.overallScore} size={148} strokeWidth={10} color="#F4FFA9" trackColor="rgba(252,255,215,0.12)">
                  <div className="text-center">
                    <p className="font-display text-5xl font-bold leading-none tracking-tighter text-glow-400">
                      <AnimatedCounter value={analysis.overallScore} duration={1.2} />
                    </p>
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide2 text-surface-50/60">/ 100</p>
                  </div>
                </CircularProgress>
                <div className="text-center sm:text-left">
                  <span className="eyebrow-dark">
                    <Check className="h-3 w-3" aria-hidden="true" /> Resume analysis complete
                  </span>
                  <h1 className="text-display mt-3 text-2xl text-surface-50 sm:text-3xl">Overall score: {analysis.overallScore}</h1>
                  <p className="mt-1.5 text-sm text-surface-50/70">
                    Target role · <span className="rounded-full bg-glow-400 px-2 py-0.5 font-semibold text-midnight-900">{analysis.targetRole}</span>
                  </p>
                  {analysis.careerReadiness && (
                    <div className="mt-4 flex max-w-md items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.05] p-3 text-left">
                      <Compass className="mt-0.5 h-4 w-4 flex-shrink-0 text-glow-400" aria-hidden="true" />
                      <p className="text-xs leading-relaxed text-surface-50/75">{analysis.careerReadiness}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-shrink-0 flex-wrap justify-center gap-2.5">
                <button onClick={resetAnalysis} className="btn-ghost-dark">
                  New resume
                </button>
                <button
                  onClick={() => generateReport(analysis, file?.name || "Resume")}
                  className="btn-accent !border-glow-400"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Report
                </button>
              </div>
            </div>

            {analysis.resumeSummary && (
              <p className="relative mt-6 max-w-3xl border-t border-white/10 pt-5 text-sm leading-relaxed text-surface-50/70">
                {analysis.resumeSummary}
              </p>
            )}
          </motion.div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            {/* Category Analysis — one scannable tile per category */}
            <section className="surface-panel p-5 sm:p-6 lg:col-span-3" aria-labelledby="ra-category-heading">
              <div className="mb-5 flex items-center justify-between gap-3">
                <h3 id="ra-category-heading" className="text-base font-bold text-midnight-900">Category analysis</h3>
                <span className="badge-outline">{Object.keys(analysis.categoryScores).length} areas</span>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {Object.entries(analysis.categoryScores).map(([key, data], i) => {
                  const percent = Math.round((data.score / data.max) * 100);
                  const meta = CATEGORY_META[key] || { icon: Star, color: 'text-midnight-900', bg: 'bg-brand-200 border border-midnight-900/10' };
                  const Icon = meta.icon;
                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      title={data.explanation}
                      className="group rounded-xl border border-midnight-900/10 bg-surface-50/50 p-4 transition-colors hover:border-midnight-900/30"
                    >
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2.5">
                          <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${meta.bg} ${meta.color}`}>
                            <Icon className="h-4 w-4" aria-hidden="true" />
                          </div>
                          <span className="text-sm font-semibold leading-tight text-midnight-900">{data.label}</span>
                        </div>
                        <span className="flex-shrink-0 font-display text-lg font-bold leading-none text-midnight-900">
                          {data.score}<span className="text-xs font-semibold text-midnight-500">/{data.max}</span>
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-midnight-900/10">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.04 }}
                          className={`h-full rounded-full ${
                            percent >= 80 ? 'bg-midnight-900' : percent >= 60 ? 'bg-brand-500' : 'bg-rose-700'
                          }`}
                        />
                      </div>
                      {data.explanation && (
                        <p className="mt-2.5 text-xs leading-relaxed text-midnight-600 line-clamp-2 group-hover:line-clamp-none">{data.explanation}</p>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </section>

            {/* ATS + keywords */}
            <section className="flex flex-col gap-6 lg:col-span-2" aria-label="ATS compatibility and keywords">
              <div className="surface-panel p-5 sm:p-6">
                <h3 className="mb-5 text-base font-bold text-midnight-900">ATS compatibility</h3>
                <div className="flex items-center gap-5">
                  <CircularProgress percentage={analysis.atsScore} size={96} strokeWidth={8} color={getScoreTone(analysis.atsScore).ring} trackColor="rgba(26,26,26,0.1)">
                    <span className={`font-display text-2xl font-bold ${getScoreTone(analysis.atsScore).text}`}>{analysis.atsScore}%</span>
                  </CircularProgress>
                  <div>
                    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${getScoreTone(analysis.atsScore).chip}`}>
                      {analysis.atsScore >= 80 ? 'Strong match' : analysis.atsScore >= 60 ? 'Good match' : 'Needs work'}
                    </span>
                    <p className="mt-2 text-xs leading-relaxed text-midnight-500">How well parsers can read this resume.</p>
                  </div>
                </div>
              </div>

              <div className="surface-lilac space-y-5 p-5 sm:p-6">
                <div>
                  <h4 className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-midnight-700">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-midnight-900 text-glow-400">
                      <Check className="h-3 w-3" aria-hidden="true" />
                    </span>
                    Found keywords
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.foundKeywords.length > 0 ? analysis.foundKeywords.map((k, i) => (
                      <Badge key={i} variant="lime" className="!normal-case !tracking-normal">{k}</Badge>
                    )) : <p className="text-xs text-midnight-600">None detected.</p>}
                  </div>
                </div>

                <div className="border-t border-midnight-900/10 pt-5">
                  <h4 className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-midnight-700">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-700 text-surface-50">
                      <X className="h-3 w-3" aria-hidden="true" />
                    </span>
                    Missing keywords
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.missingKeywords.length > 0 ? analysis.missingKeywords.map((k, i) => (
                      <Badge key={i} variant="outline" className="!normal-case !tracking-normal border-dashed !border-midnight-900/30 bg-surface-0/70 !text-midnight-900">{k}</Badge>
                    )) : <p className="text-xs text-midnight-600">None — great coverage.</p>}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Strengths / Weaknesses */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="surface-panel p-5 sm:p-6">
              <h3 className="mb-4 flex items-center gap-2.5 text-base font-bold text-midnight-900">
                <div className="icon-tile-lime h-8 w-8 !rounded-lg">
                  <Check className="h-4 w-4" aria-hidden="true" />
                </div>
                Key strengths
              </h3>
              <ul className="space-y-3">
                {analysis.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm leading-relaxed text-midnight-700">
                    <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-midnight-900" />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            <div className="surface-panel p-5 sm:p-6">
              <h3 className="mb-4 flex items-center gap-2.5 text-base font-bold text-midnight-900">
                <div className="icon-tile h-8 w-8 !rounded-lg">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                </div>
                Areas to improve
              </h3>
              <ul className="space-y-3">
                {analysis.weaknesses.map((improvement, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm leading-relaxed text-midnight-700">
                    <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* AI Recommendations — expandable, lilac AI panel */}
          <div className="surface-lilac p-5 sm:p-6">
            <h3 className="mb-5 flex items-center gap-2.5 text-base font-bold text-midnight-900">
              <div className="icon-tile-dark h-8 w-8 !rounded-lg">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
              </div>
              AI recommendations
            </h3>
            <div className="space-y-2.5">
              {analysis.recommendations.map((rec, index) => {
                const open = expandedRec === index;
                return (
                  <div
                    key={index}
                    className={`overflow-hidden rounded-xl border bg-surface-0 transition-colors ${
                      open ? 'border-midnight-900/30' : 'border-midnight-900/10 hover:border-midnight-900/25'
                    }`}
                  >
                    <button
                      onClick={() => setExpandedRec(open ? -1 : index)}
                      aria-expanded={open}
                      className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                            open ? 'border border-midnight-900 bg-glow-400 text-midnight-900' : 'bg-midnight-900 text-surface-50'
                          }`}
                        >
                          {index + 1}
                        </span>
                        <span className="font-medium text-midnight-900">{rec.title}</span>
                      </span>
                      <ChevronDown className={`h-4 w-4 flex-shrink-0 text-midnight-500 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
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
                            <p className="text-sm leading-relaxed text-midnight-700">{rec.description}</p>
                            {rec.category && (
                              <span className="badge-lilac mt-3 !normal-case !tracking-normal">
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
                <div className="surface-panel p-5 sm:p-6">
                  <h3 className="mb-4 flex items-center gap-2.5 text-base font-bold text-midnight-900">
                    <div className="icon-tile-lime h-8 w-8 !rounded-lg">
                      <TrendingUp className="h-4 w-4" aria-hidden="true" />
                    </div>
                    Suggested improvements
                  </h3>
                  <ul className="space-y-3">
                    {analysis.suggestedImprovements.map((item, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm leading-relaxed text-midnight-700">
                        <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-midnight-900" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.missingInformation?.length > 0 && (
                <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 sm:p-6">
                  <h3 className="mb-4 flex items-center gap-2.5 text-base font-bold text-amber-900">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
                      <Info className="h-4 w-4" aria-hidden="true" />
                    </div>
                    Missing information
                  </h3>
                  <ul className="space-y-2.5">
                    {analysis.missingInformation.map((item, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm leading-relaxed text-amber-900">
                        <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-600" />
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
