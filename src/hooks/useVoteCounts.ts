import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const useVoteCounts = () => {
  const [voteCounts, setVoteCounts] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'votes'), (snapshot) => {
      const counts: { [key: string]: number } = {};
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        counts[data.candidateId] = (counts[data.candidateId] || 0) + 1;
      });
      setVoteCounts(counts);
    });

    return () => unsubscribe();
  }, []);

  return voteCounts;
};
