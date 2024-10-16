import { db } from '../firebaseConfig';
import { collection, getDocs, doc, runTransaction, increment, addDoc } from 'firebase/firestore';

export interface Candidate {
  id: string;
  name: string;
  party: string;
  votes: number;
  photoUrl: string;
}

export const getCandidates = async (): Promise<Candidate[]> => {
  const candidatesRef = collection(db, 'candidates');
  const snapshot = await getDocs(candidatesRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Candidate));
};

export const submitVote = async (userId: string, candidateId: string) => {
  const voteRef = collection(db, 'votes');
  const candidateRef = doc(db, 'candidates', candidateId);

  await runTransaction(db, async (transaction) => {
    const candidateDoc = await transaction.get(candidateRef);
    if (!candidateDoc.exists()) {
      throw new Error('Candidate does not exist');
    }

    // Add a new vote document
    await addDoc(voteRef, {
      candidateId,
      userId,
      timestamp: new Date()
    });

    // Increment the vote count for the candidate
    transaction.update(candidateRef, { votes: increment(1) });
  });
};

export const getResults = async (): Promise<Candidate[]> => {
  const candidatesRef = collection(db, 'candidates');
  const snapshot = await getDocs(candidatesRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Candidate));
};
