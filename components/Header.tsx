
import React from 'react';
import { SparklesIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="py-6 bg-slate-900/70 backdrop-blur-lg border-b border-slate-700/50 sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-3">
          <SparklesIcon className="w-8 h-8 text-indigo-400" />
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Before<span className="text-slate-400">After</span>UI
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
