import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export const getUserVotingStatus = async (userEmail: string): Promise<boolean> => {
  const userRef = doc(db, 'users', userEmail);
  const userDoc = await getDoc(userRef);
  return userDoc.data()?.hasVoted || false;
};