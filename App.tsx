import React, { useState, useCallback, useEffect } from 'react';
import { TechStack } from './types';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import StackSelector from './components/StackSelector';
import ResultDisplay from './components/ResultDisplay';
import { analyzeUiDifferenceStream } from './services/geminiService';
import { SparklesIcon, MagicWandIcon } from './components/icons';
import InputTabs from './components/InputTabs';
import { CodeFile } from './components/CodeManager';
import { EXAMPLE_DATA } from './assets/example';
import HistoryPanel, { HistoryEntry } from './components/HistoryPanel';

const App: React.FC = () => {
  const [selectedStack, setSelectedStack] = useState<TechStack | null>(null);
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);
  
  const [beforeCodeFiles, setBeforeCodeFiles] = useState<CodeFile[]>([]);
  const [additionalInstructions, setAdditionalInstructions] = useState<string>('');

  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('analysisHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to load history from localStorage", e);
    }
  }, []);

  const addToHistory = (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => {
    setHistory(prevHistory => {
      const newEntry: HistoryEntry = {
        ...entry,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      };
      const updatedHistory = [newEntry, ...prevHistory].slice(0, 20); // Keep last 20 entries
      try {
        localStorage.setItem('analysisHistory', JSON.stringify(updatedHistory));
      } catch (e) {
        console.error("Failed to save history to localStorage", e);
      }
      return updatedHistory;
    });
  };

  const loadFromHistory = (entry: HistoryEntry) => {
    setSelectedStack(entry.stack);
    setBeforeImage(entry.beforeImage);
    setAfterImage(entry.afterImage);
    setBeforeCodeFiles(entry.codeFiles);
    setAdditionalInstructions(entry.instructions);
    setAnalysisResult(entry.result);
    setError(null);
    setIsLoading(false);
    setIsStreaming(false);
  };


  const handleAnalyze = useCallback(async () => {
    if (!beforeImage || !afterImage || !selectedStack) {
      setError('Please provide the current UI screenshot, target design screenshot, and select a technology stack.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult('');

    try {
      const stream = analyzeUiDifferenceStream(
        beforeImage,
        afterImage,
        beforeCodeFiles,
        additionalInstructions,
        selectedStack
      );
      
      setIsLoading(false);
      setIsStreaming(true);
      
      let fullResult = '';
      for await (const textChunk of stream) {
        fullResult += textChunk;
        setAnalysisResult(prev => (prev || '') + textChunk);
      }

      addToHistory({
        beforeImage,
        afterImage,
        codeFiles: beforeCodeFiles,
        instructions: additionalInstructions,
        stack: selectedStack,
        result: fullResult,
      });

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during analysis.');
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  }, [beforeImage, afterImage, selectedStack, beforeCodeFiles, additionalInstructions]);

  const handleLoadExample = () => {
    setSelectedStack(EXAMPLE_DATA.stack);
    setBeforeImage(EXAMPLE_DATA.beforeImage);
    setAfterImage(EXAMPLE_DATA.afterImage);
    setBeforeCodeFiles(EXAMPLE_DATA.codeFiles);
    setAdditionalInstructions('This is a simple profile card. Please make the code cleaner and more modern using Tailwind CSS best practices.');
    setAnalysisResult(null);
    setError(null);
  };

  const isAnalyzeDisabled = !beforeImage || !afterImage || !selectedStack || isLoading || isStreaming;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex justify-center items-center gap-4 mb-4">
             <p className="text-center text-lg text-slate-400">
              Upload your UI, select your stack, and our AI will generate a step-by-step guide to bridge the gap.
            </p>
            <button onClick={handleLoadExample} className="flex items-center gap-2 text-sm bg-slate-700/80 hover:bg-slate-700 text-indigo-300 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap">
              <MagicWandIcon className="w-4 h-4" />
              Load Example
            </button>
          </div>

          <div className="w-full max-w-2xl mx-auto mb-8">
            <StackSelector
              selectedStack={selectedStack}
              onStackChange={(stackId) => setSelectedStack(stackId as TechStack)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-lg flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-center text-white mb-2">Current UI</h2>
              <InputTabs 
                imageValue={beforeImage}
                onImageUpload={setBeforeImage}
                onCodeFilesChange={setBeforeCodeFiles}
                initialCodeFiles={beforeCodeFiles}
                instructions={additionalInstructions}
                onInstructionsChange={setAdditionalInstructions}
              />
            </div>
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-lg flex flex-col gap-6">
              <h2 className="text-2xl font-bold text-center text-white">Target Design</h2>
              <ImageUploader
                id="after-image"
                title="Upload Mockup"
                value={afterImage}
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
              ) : isStreaming ? (
                 <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating plan...
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
          
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              {(isLoading || isStreaming || analysisResult) && (
                <div>
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <h2 className={`text-3xl font-bold text-center text-white transition-all ${isStreaming ? 'text-indigo-400 animate-pulse' : ''}`}>AI Transformation Plan</h2>
                  </div>
                  <ResultDisplay result={analysisResult} isLoading={isLoading} />
                </div>
              )}
            </div>
            <div className="lg:col-span-1">
              <HistoryPanel history={history} onLoad={loadFromHistory} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;