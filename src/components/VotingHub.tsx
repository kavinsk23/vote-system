import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Button, Card, CardContent, CardMedia, AppBar, Toolbar, Link } from '@mui/material';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const VotingHub: React.FC = () => {
  const [candidates, setCandidates] = useState<any[]>([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      const candidatesCollection = collection(db, 'candidates');
      const candidateSnapshot = await getDocs(candidatesCollection);
      const candidateList = candidateSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCandidates(candidateList);
    };

    fetchCandidates();
  }, []); // Ensure the dependency array is correct

  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
      <AppBar position="static" style={{ marginBottom: '2rem' }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            VotingHub
          </Typography>
          <Link href="/dashboard" color="inherit" style={{ marginRight: '1rem' }}>
            Dashboard
          </Link>
          <Link href="/vote" color="inherit" style={{ marginRight: '1rem' }}>
            Vote
          </Link>
          <Link href="/results" color="inherit">
            Results
          </Link>
        </Toolbar>
      </AppBar>
      <Grid container spacing={3}>
        {candidates.map(candidate => (
          <Grid item xs={12} sm={6} md={4} key={candidate.id}>
            <Card style={{ borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
              <CardMedia
                component="img"
                alt={candidate.name}
                height="140"
                image={candidate.photoUrl}
              />
              <CardContent>
                <Typography variant="h6">{candidate.name}</Typography>
                <Typography variant="body2" color="textSecondary" style={{ marginBottom: '1rem' }}>
                  {candidate.party}
                </Typography>
                <Button variant="contained" color="primary" fullWidth>
                  Vote
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default VotingHub;
