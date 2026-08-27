import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Upload, FileText, Download, Check, AlertCircle, Star, TrendingUp, Users, Target, Briefcase, Compass, Info } from 'lucide-react';
import { generateReport } from "../utils/generateReport";
import { resumeService } from '../services/resumeService';
import ResumeChat from '../components/ResumeChat';

const TARGET_ROLES = [
  'Software Engineer',
  'Full Stack Developer',
  'Backend Developer',
  'Data Scientist',
  'Machine Learning Engineer',
  'Data Analyst'
];

// Category keys returned by the AI analyzer -> badge color for the
// recommendations list. Falls back to gray for anything unrecognized.
const CATEGORY_BADGE_COLOR = {
  atsCompatibility: 'bg-blue-100 text-blue-800',
  structure: 'bg-purple-100 text-purple-800',
  skillsMatch: 'bg-green-100 text-green-800',
  projects: 'bg-indigo-100 text-indigo-800',
  experience: 'bg-orange-100 text-orange-800',
  achievements: 'bg-pink-100 text-pink-800',
  keywordMatch: 'bg-cyan-100 text-cyan-800',
  writingQuality: 'bg-yellow-100 text-yellow-800'
};

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [chatSessionId, setChatSessionId] = useState(null);

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
      // Parse + index the resume (also powers the AI chat assistant below).
      const { sessionId } = await resumeService.uploadForChat(file);
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

      let message = serverMessage;
      if (!message) {
        if (status === 429) message = 'The server is busy right now. Please wait a minute and try again.';
        else if (!error.response) message = 'Cannot reach the server. Check your connection and try again.';
        else message = 'Could not analyze your resume right now. Please try again.';
      }
      toast.error(message);
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const resetAnalysis = () => {
    setFile(null);
    setAnalysis(null);
    setAnalyzing(false);
    setChatSessionId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Resume Analyzer</h1>
          <p className="text-lg text-gray-600">
            Get instant feedback on your resume and improve your chances of landing your dream job
          </p>
        </div>

        {!analysis ? (
          <div className="max-w-2xl mx-auto">
            {/* Upload Section */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              {/* Target Role Selector — required before analysis */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Briefcase className="h-4 w-4 inline mr-1.5 -mt-0.5" />
                  Target Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select the role you're targeting...</option>
                  {TARGET_ROLES.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  Your resume is scored specifically against this role's expected skills and keywords.
                </p>
              </div>

              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={() => setDragActive(true)}
                onDragLeave={() => setDragActive(false)}
              >
                {file ? (
                  <div className="space-y-4">
                    <FileText className="h-16 w-16 text-green-600 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-900">{file.name}</p>
                      <p className="text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={analyzeResume}
                        disabled={analyzing || !targetRole}
                        title={!targetRole ? 'Select a target role first' : undefined}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {analyzing ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Analyzing...
                          </div>
                        ) : (
                          'Analyze Resume'
                        )}
                      </button>
                      <button
                        onClick={resetAnalysis}
                        className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Remove File
                      </button>
                    </div>
                    {!targetRole && (
                      <p className="text-sm text-amber-600">Select a target role above to enable analysis.</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-16 w-16 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-900">Upload your resume</p>
                      <p className="text-gray-500">Drag and drop your PDF file here, or click to browse</p>
                    </div>
                    <label className="inline-block">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <span className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-block">
                        Choose File
                      </span>
                    </label>
                    <p className="text-sm text-gray-400">Supported format: PDF (Max 10MB)</p>
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <Target className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">ATS Optimization</h3>
                  <p className="text-gray-600 text-sm">Check how well your resume performs with Applicant Tracking Systems</p>
                </div>
                <div className="text-center p-4">
                  <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Improvement Tips</h3>
                  <p className="text-gray-600 text-sm">Get personalized suggestions to make your resume stand out</p>
                </div>
                <div className="text-center p-4">
                  <Users className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Industry Standards</h3>
                  <p className="text-gray-600 text-sm">Compare your resume against industry best practices</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Analysis Results */
          <div className="space-y-8">
            {/* Overall Score */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getScoreBackground(analysis.overallScore)} mb-4`}>
                  <span className={`text-3xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                    {analysis.overallScore}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Overall Score</h2>
                <p className="text-gray-600">
                  Analyzed for <span className="font-semibold text-gray-800">{analysis.targetRole}</span> · {analysis.overallScore}/100
                </p>

                {analysis.resumeSummary && (
                  <p className="text-gray-600 max-w-2xl mx-auto mt-4 text-sm leading-relaxed">
                    {analysis.resumeSummary}
                  </p>
                )}

                {analysis.careerReadiness && (
                  <div className="max-w-2xl mx-auto mt-4 bg-blue-50 border border-blue-100 rounded-lg p-4 text-left flex items-start gap-3">
                    <Compass className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900">Career Readiness</p>
                      <p className="text-sm text-blue-800">{analysis.careerReadiness}</p>
                    </div>
                  </div>
                )}

                <div className="flex justify-center gap-4 mt-6">
                  <button
                    onClick={resetAnalysis}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Analyze Another Resume
                  </button>
                  <button
                    onClick={() => generateReport(analysis, file?.name || "Resume")}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Category Scores */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Analysis</h3>
                <div className="space-y-4">
                  {Object.entries(analysis.categoryScores).map(([key, data]) => {
                    const percent = Math.round((data.score / data.max) * 100);
                    return (
                      <div key={key} title={data.explanation}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-700">{data.label}</span>
                          <div className="flex items-center gap-3">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  percent >= 80 ? 'bg-green-500' :
                                  percent >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${percent}%` }}
                              ></div>
                            </div>
                            <span className={`font-semibold ${getScoreColor(percent)}`}>
                              {data.score}/{data.max}
                            </span>
                          </div>
                        </div>
                        {data.explanation && (
                          <p className="text-xs text-gray-400">{data.explanation}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ATS Score */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">ATS Compatibility</h3>
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${getScoreBackground(analysis.atsScore)} mb-3`}>
                    <span className={`text-2xl font-bold ${getScoreColor(analysis.atsScore)}`}>
                      {analysis.atsScore}%
                    </span>
                  </div>
                  <p className="text-gray-600">ATS Optimization Score</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Found Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.foundKeywords.map((keyword, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Missing Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.missingKeywords.map((keyword, index) => (
                        <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-sm rounded">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Strengths and Improvements */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  Strengths
                </h3>
                <ul className="space-y-3">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  Areas for Improvement
                </h3>
                <ul className="space-y-3">
                  {analysis.weaknesses.map((improvement, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
                      <span className="text-gray-700">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-blue-600" />
                Detailed Recommendations
              </h3>
              <div className="space-y-4">
                {analysis.recommendations.map((rec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <h4 className="font-semibold text-gray-900 mb-2">{rec.title}</h4>
                    <p className="text-gray-600">{rec.description}</p>
                    {rec.category && (
                      <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                        CATEGORY_BADGE_COLOR[rec.category] || 'bg-gray-100 text-gray-800'
                      }`}>
                        {analysis.categoryScores[rec.category]?.label || rec.category}
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Suggested Improvements */}
            {analysis.suggestedImprovements?.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Suggested Improvements
                </h3>
                <ul className="space-y-3">
                  {analysis.suggestedImprovements.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Missing Information */}
            {analysis.missingInformation?.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-amber-900 mb-4 flex items-center gap-2">
                  <Info className="h-5 w-5 text-amber-600" />
                  Missing Information
                </h3>
                <ul className="space-y-2">
                  {analysis.missingInformation.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                      <span className="text-amber-800">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* AI Chat Assistant */}
            <ResumeChat sessionId={chatSessionId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
