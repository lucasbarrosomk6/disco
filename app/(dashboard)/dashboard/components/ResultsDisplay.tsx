import React from 'react';
import DownloadButton from './DownloadButton';
import { Section } from '@/app/store/discoAITypes';

interface ResultsDisplayProps {
  sections: Section[];
  companyName: string;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ sections, companyName }) => {
  return (
    <div>
      {/* Display your results here */}
      <DownloadButton sections={sections} companyName={companyName} />
    </div>
  );
};

export default ResultsDisplay;