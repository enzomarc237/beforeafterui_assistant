import React, { useState, useCallback } from 'react';
import { TechStack } from './types';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import StackSelector from './components/StackSelector';
import ResultDisplay from './components/ResultDisplay';
import { analyzeUiDifference } from './services/geminiService';
import { SparklesIcon } from './components/icons';
import InputTabs from './components/InputTabs';
import { CodeFile } from './components/CodeManager';

const App: React.FC = () => {
  const [selectedStack, setSelectedStack] = useState<TechStack | null>(null);
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);
  
  const [beforeCodeFiles, setBeforeCodeFiles] = useState<CodeFile[]>([]);
  const [additionalInstructions, setAdditionalInstructions] = useState<string>('');

  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!beforeImage || !afterImage || !selectedStack) {
      setError('Please provide the current UI screenshot, target design screenshot, and select a technology stack.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeUiDifference(
        beforeImage,
        afterImage,
        beforeCodeFiles,
        additionalInstructions,
        selectedStack
      );
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  }, [beforeImage, afterImage, selectedStack, beforeCodeFiles, additionalInstructions]);

  const isAnalyzeDisabled = !beforeImage || !afterImage || !selectedStack || isLoading;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-lg text-slate-400 mb-4">
            Upload your current UI, target design, and select your tech stack. Our AI will generate a step-by-step guide to bridge the gap.
          </p>

          <div className="w-full max-w-2xl mx-auto mb-8">
            <StackSelector
              selectedStack={selectedStack}
              onStackChange={(stackId) => setSelectedStack(stackId as TechStack)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Current UI Column */}
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-lg flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-center text-white mb-2">Current UI</h2>
              <InputTabs 
                onImageUpload={setBeforeImage}
                onCodeFilesChange={setBeforeCodeFiles}
                onInstructionsChange={setAdditionalInstructions}
              />
            </div>

            {/* Target Design Column */}
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-lg flex flex-col gap-6">
              <h2 className="text-2xl font-bold text-center text-white">Target Design</h2>
              <ImageUploader
                id="after-image"
                title="Upload Mockup"
                onImageUpload={setAfterImage}
              />
            </div>
          </div>
          
          <div className="text-center">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzeDisabled}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-full shadow-lg transition-all duration-300 hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-105 disabled:scale-100"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <SparklesIcon className="w-6 h-6" />
                  Analyze Differences
                </>
              )}
            </button>
          </div>

          {error && <div className="mt-8 text-center bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg max-w-3xl mx-auto">{error}</div>}
          
          {(isLoading || analysisResult) && (
            <div className="mt-12">
              <div className="flex items-center justify-center gap-4 mb-6">
                <h2 className="text-3xl font-bold text-center text-white">AI Transformation Plan</h2>
              </div>
              <ResultDisplay result={analysisResult} isLoading={isLoading} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
