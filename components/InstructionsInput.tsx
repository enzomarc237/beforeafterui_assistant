import React from 'react';

interface InstructionsInputProps {
  onInstructionsChange: (instructions: string) => void;
}

const InstructionsInput: React.FC<InstructionsInputProps> = ({ onInstructionsChange }) => {
  return (
    <div className="w-full">
      <label htmlFor="instructions-input" className="block text-sm font-medium text-slate-400 mb-2">
        Additional Instructions (Optional)
      </label>
      <textarea
        id="instructions-input"
        onChange={(e) => onInstructionsChange(e.target.value)}
        placeholder="e.g., 'Focus on accessibility improvements' or 'Make sure the new button matches our design system's primary button style.'"
        rows={8}
        className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-300 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-y"
        spellCheck="false"
      />
    </div>
  );
};

export default InstructionsInput;
