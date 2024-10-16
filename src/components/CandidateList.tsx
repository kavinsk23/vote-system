import React, { memo } from 'react';
import { Candidate } from '../hooks/useCandidates';

interface CandidateListProps {
  candidates: Candidate[];
  onSelect: (id: string) => void;
  selectedCandidate: string | null;
}

const CandidateList: React.FC<CandidateListProps> = memo(({ candidates, onSelect, selectedCandidate }) => {
  return (
    <>
      {candidates.map(candidate => (
        <button
          key={candidate.id}
          onClick={() => onSelect(candidate.id)}
          style={{ backgroundColor: selectedCandidate === candidate.id ? 'lightblue' : 'white' }}
        >
          {candidate.name}
        </button>
      ))}
    </>
  );
});

export default CandidateList;