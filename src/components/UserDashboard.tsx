import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, CircularProgress, Paper, Card, CardContent } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';

// Register the necessary components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UserDashboard: React.FC = () => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [activeElection, setActiveElection] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchActiveElection = async () => {
      try {
        const activeElectionQuery = query(collection(db, 'elections'), where('status', '==', 'active'));
        const activeElectionSnapshot = await getDocs(activeElectionQuery);
        if (!activeElectionSnapshot.empty) {
          const electionData = activeElectionSnapshot.docs[0].data();
          setActiveElection({ id: activeElectionSnapshot.docs[0].id, ...electionData });
        } else {
          console.log('No active election found');
        }
      } catch (error) {
        console.error('Error fetching active election:', error);
      }
    };

    fetchActiveElection();
  }, []); // Fetch active election on component mount

  useEffect(() => {
    const fetchCandidates = async () => {
      if (activeElection && activeElection.id) { // Ensure activeElection is defined and has an id
        try {
          const candidatesQuery = query(
            collection(db, 'candidates'), 
            where('electionId', '==', activeElection.id), 
            orderBy('votes', 'desc')
          );
          const candidatesSnapshot = await getDocs(candidatesQuery);
          setCandidates(candidatesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          setLoading(false);
        } catch (error) {
          console.error('Error fetching candidates:', error);
          alert('Error fetching candidates. Please check the console for more details.');
        }
      }
    };

    fetchCandidates();
  }, [activeElection]); // Fetch candidates when activeElection changes

  const data = {
    labels: candidates.map(candidate => candidate.name),
    datasets: [
      {
        label: 'Votes',
        data: candidates.map(candidate => candidate.votes),
        backgroundColor: candidates.map(() => `#${Math.floor(Math.random()*16777215).toString(16)}`), // Random color for each candidate
        hoverBackgroundColor: candidates.map(() => `#${Math.floor(Math.random()*16777215).toString(16)}`),
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.dataset.label}: ${context.raw}`;
          },
        },
      },
    },
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        User Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} style={{ padding: '1rem', textAlign: 'center' }}>
            <HowToVoteIcon style={{ fontSize: 48, color: '#3f51b5' }} />
            <Typography variant="h6">Total Votes</Typography>
            <Typography variant="h4">{candidates.reduce((sum, c) => sum + c.votes, 0)}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} style={{ padding: '1rem', textAlign: 'center' }}>
            <PeopleIcon style={{ fontSize: 48, color: '#f50057' }} />
            <Typography variant="h6">Candidates</Typography>
            <Typography variant="h4">{candidates.length}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} style={{ padding: '1rem', textAlign: 'center' }}>
            <EventIcon style={{ fontSize: 48, color: '#00a152' }} />
            <Typography variant="h6">Active Election</Typography>
            <Typography variant="h4">{activeElection ? 'Yes' : 'No'}</Typography>
          </Paper>
        </Grid>
      </Grid>
      {activeElection ? (
        <Card style={{ marginTop: '2rem' }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Active Election: {activeElection.title}
            </Typography>
            <Bar data={data} options={options} />
          </CardContent>
        </Card>
      ) : (
        <Typography variant="h6" gutterBottom style={{ marginTop: '2rem' }}>
          No active election available.
        </Typography>
      )}
    </Container>
  );
};

export default UserDashboard;
