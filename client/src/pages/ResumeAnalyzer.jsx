import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Download, Check, AlertCircle, Star, TrendingUp, Users, Target } from 'lucide-react';

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [dragActive, setDragActive] = useState(false);

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
    if (!file) return;
    
    setAnalyzing(true);
    
    // Simulate API call
    setTimeout(() => {
      setAnalysis({
        overallScore: 75,
        strengths: [
          'Strong technical skills section',
          'Good project descriptions',
          'Clear education details',
          'Professional formatting'
        ],
        improvements: [
          'Add more quantifiable achievements',
          'Include relevant certifications',
          'Improve work experience descriptions',
          'Add keywords for ATS optimization'
        ],
        sections: {
          contact: { score: 90, status: 'excellent' },
          summary: { score: 65, status: 'good' },
          experience: { score: 70, status: 'good' },
          education: { score: 85, status: 'excellent' },
          skills: { score: 80, status: 'excellent' },
          projects: { score: 75, status: 'good' }
        },
        atsScore: 68,
        keywords: ['JavaScript', 'React', 'Node.js', 'Python', 'MongoDB'],
        missingKeywords: ['AWS', 'Docker', 'Kubernetes', 'Machine Learning'],
        recommendations: [
          {
            type: 'format',
            title: 'Use action verbs',
            description: 'Start bullet points with strong action verbs like "Developed", "Implemented", "Optimized"'
          },
          {
            type: 'content',
            title: 'Quantify achievements',
            description: 'Add numbers and percentages to show impact (e.g., "Improved performance by 30%")'
          },
          {
            type: 'keywords',
            title: 'Add relevant keywords',
            description: 'Include industry-specific keywords to improve ATS compatibility'
          }
        ]
      });
      setAnalyzing(false);
    }, 3000);
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
                        disabled={analyzing}
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
                <p className="text-gray-600">Your resume has been analyzed across multiple criteria</p>
                
                <div className="flex justify-center gap-4 mt-6">
                  <button
                    onClick={resetAnalysis}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Analyze Another Resume
                  </button>
                  <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    <Download className="h-4 w-4 inline mr-2" />
                    Download Report
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Section Scores */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Section Analysis</h3>
                <div className="space-y-4">
                  {Object.entries(analysis.sections).map(([section, data]) => (
                    <div key={section} className="flex items-center justify-between">
                      <span className="font-medium text-gray-700 capitalize">
                        {section.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              data.score >= 80 ? 'bg-green-500' :
                              data.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${data.score}%` }}
                          ></div>
                        </div>
                        <span className={`font-semibold ${getScoreColor(data.score)}`}>
                          {data.score}%
                        </span>
                      </div>
                    </div>
                  ))}
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
                      {analysis.keywords.map((keyword, index) => (
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
                  {analysis.improvements.map((improvement, index) => (
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
                    <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                      rec.type === 'format' ? 'bg-blue-100 text-blue-800' :
                      rec.type === 'content' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {rec.type}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalyzer;