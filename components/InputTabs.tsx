import React, { useState } from 'react';
import ImageUploader from './ImageUploader';
import CodeManager, { CodeFile } from './CodeManager';
import InstructionsInput from './InstructionsInput';

interface InputTabsProps {
  imageValue: string | null;
  instructions: string;
  initialCodeFiles: CodeFile[];
  onImageUpload: (base64: string) => void;
  onCodeFilesChange: (files: CodeFile[]) => void;
  onInstructionsChange: (instructions: string) => void;
}

type Tab = 'screenshot' | 'code' | 'instructions';

const InputTabs: React.FC<InputTabsProps> = ({ 
  imageValue, 
  instructions, 
  initialCodeFiles,
  onImageUpload, 
  onCodeFilesChange, 
  onInstructionsChange 
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('screenshot');

  const getTabClass = (tabName: Tab) => {
    return `px-4 py-2.5 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none ${
      activeTab === tabName
        ? 'bg-indigo-600 text-white'
        : 'text-slate-300 hover:bg-slate-700'
    }`;
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-center bg-slate-700/50 p-1 rounded-lg">
        <button onClick={() => setActiveTab('screenshot')} className={getTabClass('screenshot')}>
          Screenshot
        </button>
        <button onClick={() => setActiveTab('code')} className={getTabClass('code')}>
          Code
        </button>
        <button onClick={() => setActiveTab('instructions')} className={getTabClass('instructions')}>
          Instructions
        </button>
      </div>
      <div className="min-h-[250px] flex flex-col justify-center">
        <div className={activeTab === 'screenshot' ? '' : 'hidden'}>
            <ImageUploader id="before-image" title="Upload Screenshot" value={imageValue} onImageUpload={onImageUpload} />
        </div>
        <div className={activeTab === 'code' ? '' : 'hidden'}>
            <CodeManager initialFiles={initialCodeFiles} onFilesChange={onCodeFilesChange} />
        </div>
        <div className={activeTab === 'instructions' ? '' : 'hidden'}>
            <InstructionsInput value={instructions} onInstructionsChange={onInstructionsChange} />
        </div>
      </div>
    </div>
  );
};

export default InputTabs;