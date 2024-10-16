import React, { useEffect, useState } from 'react';
import { Grid, CircularProgress, Card, CardContent, Typography, CardMedia } from '@mui/material';
import { getFirestore, collection, query, orderBy, onSnapshot } from 'firebase/firestore'; // Firestore modular SDK

const DashboardMetrics: React.FC = () => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize Firestore
    const firestore = getFirestore();

    // Create a Firestore query
    const candidatesQuery = query(
      collection(firestore, 'candidates'),
      orderBy('votes', 'desc') // Sort by votes in descending order
    );

    // Set up a real-time listener for the query
    const unsubscribe = onSnapshot(candidatesQuery, (snapshot) => {
      const fetchedCandidates = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCandidates(fetchedCandidates);
      setLoading(false);
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <CircularProgress />; // Show loading spinner while data is being fetched
  }

  return (
    <Grid container spacing={3} justifyContent="space-between">
      {candidates.map(candidate => (
        <Grid item xs={4} key={candidate.id}>
          <Card>
            <CardMedia
              component="img"
              height="140"
              image={candidate.photoUrl}
              alt={candidate.name}
            />
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary">
                {candidate.category}
              </Typography>
              <Typography variant="h6">{candidate.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                Party: {candidate.party}
              </Typography>
              <Typography variant="body1">Votes: {candidate.votes}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardMetrics;
