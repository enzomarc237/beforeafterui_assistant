import React, { useEffect, useRef } from 'react';
import hljs from 'highlight.js';
import { CSSTransition } from 'react-transition-group';
import { CodeFile } from './CodeManager';
import { XCircleIcon } from './icons';

interface CodeViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: CodeFile;
}

const CodeViewerModal: React.FC<CodeViewerModalProps> = ({ isOpen, onClose, file }) => {
  const codeRef = useRef<HTMLElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [isOpen, file.content]);
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <CSSTransition
      in={isOpen}
      timeout={200}
      classNames="fade"
      unmountOnExit
      nodeRef={modalRef}
    >
      <div
        ref={modalRef}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="code-viewer-title"
      >
        <div 
          className="relative bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-4xl h-full max-h-[80vh] flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          <header className="flex items-center justify-between p-4 border-b border-slate-700">
            <h2 id="code-viewer-title" className="text-lg font-semibold text-white truncate">{file.name}</h2>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-white transition-colors"
              aria-label="Close code viewer"
            >
              <XCircleIcon className="w-6 h-6" />
            </button>
          </header>
          <div className="p-4 overflow-auto flex-1">
            <pre className="h-full">
              <code ref={codeRef} className={`language-${file.name.split('.').pop() || 'plaintext'} h-full block`}>
                {file.content}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </CSSTransition>
  );
};

export default CodeViewerModal;
