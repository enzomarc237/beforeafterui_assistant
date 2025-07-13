import React, { useState, useCallback, useEffect, useRef } from 'react';
import { UploadIcon, FileCodeIcon, XCircleIcon } from './icons';
import CodeViewerModal from './CodeViewerModal';

export interface CodeFile {
  name: string;
  content: string;
}

interface CodeManagerProps {
  onFilesChange: (files: CodeFile[]) => void;
  initialFiles: CodeFile[];
}

const CodeManager: React.FC<CodeManagerProps> = ({ onFilesChange, initialFiles }) => {
  const [files, setFiles] = useState<CodeFile[]>(initialFiles);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<CodeFile | null>(null);

  const isInitialMount = useRef(true);

  useEffect(() => {
    // Sync with parent state when initialFiles prop changes from history/example
     if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setFiles(initialFiles);
  }, [initialFiles]);

  useEffect(() => {
    onFilesChange(files);
  }, [files, onFilesChange]);

  const handleFileRead = (file: File) => {
    return new Promise<CodeFile>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve({ name: file.name, content });
      };
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  const handleFiles = useCallback(async (fileList: FileList | null) => {
    if (fileList) {
      const newFilesPromises = Array.from(fileList).map(handleFileRead);
      try {
        const newFiles = await Promise.all(newFilesPromises);
        setFiles(prevFiles => {
          const existingFileNames = new Set(prevFiles.map(f => f.name));
          const uniqueNewFiles = newFiles.filter(nf => !existingFileNames.has(nf.name));
          return [...prevFiles, ...uniqueNewFiles];
        });
      } catch (error) {
        console.error("Error reading files:", error);
      }
    }
  }, []);

  const removeFile = (fileName: string) => {
    setFiles(prevFiles => prevFiles.filter(f => f.name !== fileName));
  };
  
  const viewFile = (file: CodeFile) => {
    setSelectedFile(file);
    setIsModalOpen(true);
  };
  
  const onDragEnter = (e: React.DragEvent<HTMLLabelElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const onDragLeave = (e: React.DragEvent<HTMLLabelElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const onDragOver = (e: React.DragEvent<HTMLLabelElement>) => { e.preventDefault(); e.stopPropagation(); };
  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <label
          htmlFor="code-file-input"
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
          className={`flex flex-col items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer bg-slate-700/50 transition-colors duration-300 ${isDragging ? 'border-indigo-400 bg-slate-700' : 'border-slate-600 hover:border-slate-500 hover:bg-slate-700'}`}
        >
          <UploadIcon className="w-8 h-8 mb-2 text-slate-400" />
          <p className="text-sm text-slate-400">
            <span className="font-semibold text-indigo-400">Upload files</span> or drag and drop
          </p>
          <p className="text-xs text-slate-500">Add one or more code files</p>
          <input 
            id="code-file-input" 
            type="file" 
            className="hidden"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>
        
        {files.length > 0 && (
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-2">
            {files.map(file => (
              <div key={file.name} className="flex items-center justify-between bg-slate-700/80 p-2 rounded-md">
                <button onClick={() => viewFile(file)} className="flex items-center gap-2 text-left hover:text-indigo-300 transition-colors duration-200 truncate">
                  <FileCodeIcon className="w-5 h-5 text-slate-400" />
                  <span className="text-sm text-slate-300 truncate">{file.name}</span>
                </button>
                <button onClick={() => removeFile(file.name)} className="text-slate-500 hover:text-red-400 transition-colors p-1">
                  <XCircleIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedFile && (
        <CodeViewerModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          file={selectedFile}
        />
      )}
    </>
  );
};

export default CodeManager;