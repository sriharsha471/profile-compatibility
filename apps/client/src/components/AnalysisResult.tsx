import {
  CheckCircle,
  XCircle,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Download,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalysisProps {
  analysis: {
    alignmentScore: number;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    summary: string;
  };
  onReset: () => void;
}

export default function AnalysisResult({ analysis, onReset }: AnalysisProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Moderate Match';
    return 'Poor Match';
  };

  const handleDownload = () => {
    const report = `
CV ANALYSIS REPORT
==================

Alignment Score: ${analysis.alignmentScore}% - ${getScoreLabel(analysis.alignmentScore)}

Summary:
${analysis.summary}

Strengths:
${analysis.strengths.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Areas for Improvement:
${analysis.weaknesses.map((w, i) => `${i + 1}. ${w}`).join('\n')}

Recommendations:
${analysis.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

Generated: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cv-analysis-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Analysis Results</h2>
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Download Report</span>
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm font-medium">New Analysis</span>
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className={cn('h-2 bg-gradient-to-r', getScoreColor(analysis.alignmentScore))} />
        <div className="p-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <BarChart3 className="w-8 h-8 text-gray-400" />
          </div>
          <div className="space-y-2">
            <div className={cn('text-6xl font-bold bg-gradient-to-r bg-clip-text text-transparent', getScoreColor(analysis.alignmentScore))}>
              {analysis.alignmentScore}%
            </div>
            <p className="text-xl font-semibold text-gray-700">{getScoreLabel(analysis.alignmentScore)}</p>
          </div>
        </div>
      </div>

      <div className="card bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Executive Summary</h3>
        <p className="text-gray-700 leading-relaxed">{analysis.summary}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card border-l-4 border-green-500">
          <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
            <CheckCircle className="mr-2 text-green-600" size={24} />
            Key Strengths
          </h3>
          <ul className="space-y-3">
            {analysis.strengths.map((strength, i) => (
              <li key={i} className="flex items-start group">
                <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                  {i + 1}
                </span>
                <span className="ml-3 text-gray-700 group-hover:text-gray-900 transition-colors">
                  {strength}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card border-l-4 border-red-500">
          <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
            <XCircle className="mr-2 text-red-600" size={24} />
            Areas for Improvement
          </h3>
          <ul className="space-y-3">
            {analysis.weaknesses.map((weakness, i) => (
              <li key={i} className="flex items-start group">
                <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                  {i + 1}
                </span>
                <span className="ml-3 text-gray-700 group-hover:text-gray-900 transition-colors">
                  {weakness}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card border-l-4 border-blue-500">
        <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
          <TrendingUp className="mr-2 text-blue-600" size={24} />
          Recommendations
        </h3>
        <div className="space-y-3">
          {analysis.recommendations.map((rec, i) => (
            <div key={i} className="flex items-start p-3 bg-blue-50 rounded-lg group hover:bg-blue-100 transition-colors">
              <AlertCircle className="flex-shrink-0 text-blue-600 mt-0.5" size={20} />
              <span className="ml-3 text-gray-700 group-hover:text-gray-900">
                {rec}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
