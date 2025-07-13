import React, { useState, useEffect } from 'react';
import { Marked } from 'marked';
import hljs from 'highlight.js';
import { CopyIcon, DownloadIcon } from './icons';

const marked = new Marked({
  gfm: true,
  breaks: true,
  highlight: (code: string, lang: string) => {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  },
  langPrefix: 'hljs language-',
});

interface ResultDisplayProps {
  result: string | null;
  isLoading: boolean;
}

const SkeletonLoader: React.FC = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-6 bg-slate-700 rounded w-1/3"></div>
    <div className="space-y-4">
      <div className="h-4 bg-slate-700 rounded"></div>
      <div className="h-4 bg-slate-700 rounded w-5/6"></div>
    </div>
    <div className="h-5 bg-slate-700 rounded w-1/4 mt-8"></div>
    <div className="p-8 bg-slate-900/50 rounded-lg space-y-4">
      <div className="h-4 bg-slate-700 rounded"></div>
      <div className="h-4 bg-slate-700 rounded"></div>
      <div className="h-4 bg-slate-700 rounded w-1/2"></div>
    </div>
    <div className="h-4 bg-slate-700 rounded w-4/6"></div>
  </div>
);

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, isLoading }) => {
  const [sanitizedHtml, setSanitizedHtml] = useState<string>('');
  const [copyButtonText, setCopyButtonText] = useState('Copy');

  useEffect(() => {
    if (result) {
      try {
        const html = marked.parse(result) as string;
        setSanitizedHtml(html);
      } catch (error) {
        console.error('Markdown parsing error:', error);
        setSanitizedHtml('<p class="text-red-400">Could not render the analysis.</p>');
      }
    } else {
        setSanitizedHtml('');
    }
  }, [result]);
  
  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result).then(() => {
        setCopyButtonText('Copied!');
        setTimeout(() => setCopyButtonText('Copy'), 2000);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
        setCopyButtonText('Failed!');
        setTimeout(() => setCopyButtonText('Copy'), 2000);
      });
    }
  };

  const handleExport = () => {
    if (result) {
      const blob = new Blob([result], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'transformation-plan.md';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };


  return (
    <div className="relative w-full max-w-4xl mx-auto bg-slate-800/70 border border-slate-700 rounded-2xl shadow-2xl min-h-[200px]">
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <button onClick={handleCopy} disabled={isLoading || !result} className="flex items-center gap-2 bg-slate-700/80 hover:bg-slate-600/80 text-slate-300 px-3 py-1.5 rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <CopyIcon className="w-4 h-4" />
            {copyButtonText}
        </button>
        <button onClick={handleExport} disabled={isLoading || !result} className="flex items-center gap-2 bg-slate-700/80 hover:bg-slate-600/80 text-slate-300 px-3 py-1.5 rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <DownloadIcon className="w-4 h-4" />
            Export
        </button>
      </div>

      <div className="p-6 md:p-8">
        {isLoading && <SkeletonLoader />}
        {!isLoading && (result || result === '') && (
          <div 
            className="prose prose-invert prose-slate max-w-none 
                       prose-headings:text-indigo-300 prose-a:text-indigo-400 prose-strong:text-slate-100
                       prose-code:bg-slate-900/50 prose-code:p-1 prose-code:rounded-md prose-code:text-amber-300 prose-code:before:content-[''] prose-code:after:content-[''] prose-code:font-medium
                       prose-blockquote:border-indigo-500 prose-blockquote:text-slate-400
                       prose-pre:bg-slate-900/70 prose-pre:border prose-pre:border-slate-700 prose-pre:rounded-lg"
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
          />
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;