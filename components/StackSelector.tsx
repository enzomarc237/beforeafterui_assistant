
import React from 'react';
import { TechStack } from '../types';
import { TECH_STACKS } from '../constants';

interface StackSelectorProps {
  selectedStack: TechStack | null;
  onStackChange: (stack: TechStack) => void;
}

const StackSelector: React.FC<StackSelectorProps> = ({ selectedStack, onStackChange }) => {
  return (
    <div className="w-full">
      <label htmlFor="stack-selector" className="block text-sm font-medium text-slate-400 mb-2 text-center">
        Select Your Technology Stack
      </label>
      <select
        id="stack-selector"
        value={selectedStack || ''}
        onChange={(e) => onStackChange(e.target.value as TechStack)}
        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-center appearance-none"
      >
        <option value="" disabled>
          -- Choose a stack --
        </option>
        {TECH_STACKS.map((stack) => (
          <option key={stack.id} value={stack.id}>
            {stack.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default StackSelector;
