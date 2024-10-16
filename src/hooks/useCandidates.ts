import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export interface Candidate {
  id: string;
  name: string;
  party: string;
  photoUrl: string;
  votes: number;
  category: string;
}

export const useCandidates = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'candidates'), (snapshot) => {
      const candidatesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Candidate));
      setCandidates(candidatesList);
    });

    return () => unsubscribe();
  }, []);

  return candidates;
};
