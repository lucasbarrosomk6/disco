import React from 'react';
import { Section } from '../../../store/discoAITypes';
import { convertToDoc } from '../utils/convertToDoc';


interface DownloadButtonProps {
  sections: Section[];
  companyName: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ sections, companyName }) => {
  const handleDownload = () => {
    try {
      const docContent = convertToDoc(sections);
      const blob = new Blob([docContent], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${companyName}_report.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating document:', error);
      alert('An error occurred while generating the document. Please try again.');
    }
  };

  return (
    <button onClick={handleDownload} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Download Report
    </button>
  );
};

export default DownloadButton;