import React from 'react';
import { TechStack } from '../types';
import { CodeFile } from './CodeManager';

export interface HistoryEntry {
  id: string;
  timestamp: string;
  beforeImage: string;
  afterImage: string;
  codeFiles: CodeFile[];
  instructions: string;
  stack: TechStack;
  result: string;
}

interface HistoryPanelProps {
  history: HistoryEntry[];
  onLoad: (entry: HistoryEntry) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onLoad }) => {

  const formatTimestamp = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 shadow-lg h-full">
      <h3 className="text-xl font-bold text-white text-center mb-4">Analysis History</h3>
      {history.length === 0 ? (
        <p className="text-center text-slate-400 text-sm py-8">
          Your past analyses will appear here.
        </p>
      ) : (
        <div className="max-h-[500px] overflow-y-auto space-y-3 pr-2">
          {history.map(entry => (
            <div key={entry.id} className="bg-slate-800 p-3 rounded-lg border border-slate-700">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-slate-400">{formatTimestamp(entry.timestamp)}</p>
                <p className="text-xs font-medium bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded">
                  {entry.stack}
                </p>
              </div>
              <div className="flex gap-2 mb-3">
                <img src={entry.beforeImage} alt="Before" className="w-1/2 h-16 object-cover rounded-md border border-slate-600" />
                <img src={entry.afterImage} alt="After" className="w-1/2 h-16 object-cover rounded-md border border-slate-600" />
              </div>
              <button
                onClick={() => onLoad(entry)}
                className="w-full text-center bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold py-2 rounded-md transition-colors duration-200"
              >
                Load This Analysis
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPanel;
