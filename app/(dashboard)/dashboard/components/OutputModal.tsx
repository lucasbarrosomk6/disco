import React from 'react';
import ReactMarkdown from 'react-markdown';
import { convertToDoc } from '../utils/convertToDoc';
import { Section } from '../../../store/discoAITypes';


interface OutputModalProps {
  sections: Section[];
  isOpen: boolean;
  onClose: () => void;
}

const OutputModal: React.FC<OutputModalProps> = ({ sections, isOpen, onClose }) => {
  if (!isOpen) return null;
  console.log(sections)
  const documentContent = convertToDoc(sections);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-3/4 h-3/4 overflow-auto">
        <button onClick={onClose} className="float-right text-xl font-bold">&times;</button>
        <ReactMarkdown>{documentContent}</ReactMarkdown>
      </div>
    </div>
  );
};

export default OutputModal;