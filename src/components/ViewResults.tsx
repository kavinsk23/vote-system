import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';
import { Typography, List, ListItem, ListItemText } from '@mui/material';

const ViewResults: React.FC = () => {
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'candidates'), (snapshot) => {
      const resultsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setResults(resultsList);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <Typography variant="h5" gutterBottom>Election Results</Typography>
      <List>
        {results.map(result => (
          <ListItem key={result.id}>
            <ListItemText primary={result.name} secondary={`Votes: ${result.votes}`} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ViewResults;
