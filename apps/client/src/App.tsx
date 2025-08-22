import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from '@/lib/trpc';
import FileUpload from '@/components/FileUpload';
import AnalysisResult from '@/components/AnalysisResult';
import { FileText, Sparkles } from 'lucide-react';
import { fileToBase64 } from '@/lib/utils';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc',
    }),
  ],
});

function AppContent() {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jobFile, setJobFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const mutation = trpc.analyzeCV.useMutation({
    onSuccess: (data) => {
      setAnalysis(data.analysis);
      setError(null);
    },
    onError: (error) => {
      setError(error.message);
      setAnalysis(null);
    },
  });

  const handleAnalyze = async () => {
    if (!cvFile || !jobFile) {
      setError('Please upload both CV and Job Description files');
      return;
    }

    setError(null);

    try {
      const [cvBase64, jobBase64] = await Promise.all([
        fileToBase64(cvFile),
        fileToBase64(jobFile),
      ]);

      mutation.mutate({
        cvBase64,
        jobDescriptionBase64: jobBase64,
      });
    } catch (err) {
      setError('Failed to process files. Please try again.');
    }
  };

  const handleReset = () => {
    setCvFile(null);
    setJobFile(null);
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CV Analyzer
              </h1>
            </div>
            <span className="text-sm text-gray-500">AI-Powered Resume Screening</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!analysis ? (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-gray-900">
                Find Your Perfect Match
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Upload a CV and job description to get AI-powered insights on candidate-job alignment
              </p>
            </div>

            <div className="card">
              <div className="grid md:grid-cols-2 gap-6">
                <FileUpload
                  label="Candidate CV"
                  description="Upload the candidate's resume in PDF format"
                  onFileSelect={setCvFile}
                  file={cvFile}
                  accept=".pdf"
                />
                <FileUpload
                  label="Job Description"
                  description="Upload the job requirements in PDF format"
                  onFileSelect={setJobFile}
                  file={jobFile}
                  accept=".pdf"
                />
              </div>

              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleAnalyze}
                  disabled={!cvFile || !jobFile || mutation.isPending}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>{mutation.isPending ? 'Analyzing...' : 'Analyze Match'}</span>
                </button>
              </div>

              {mutation.isPending && (
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center space-x-2 text-blue-600">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <span className="text-sm">Processing documents with AI...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <AnalysisResult analysis={analysis} onReset={handleReset} />
          </div>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </trpc.Provider>
  );
}
