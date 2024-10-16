import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { Typography, Paper, Grid, CircularProgress } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';

const VoteMonitoring: React.FC = () => {
  const [voteData, setVoteData] = useState<ChartData<'bar'>>({
    labels: [],
    datasets: [{
      label: 'Votes',
      data: [],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    }]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const activeElectionQuery = query(collection(db, 'elections'), where('status', '==', 'active'));
    const unsubscribe = onSnapshot(activeElectionQuery, async (snapshot) => {
      if (!snapshot.empty) {
        const electionId = snapshot.docs[0].id;
        const candidatesQuery = query(collection(db, 'candidates'), where('electionId', '==', electionId));
        const candidatesSnapshot = await getDocs(candidatesQuery);
        
        const labels: string[] = [];
        const votes: number[] = [];
        candidatesSnapshot.forEach(doc => {
          const data = doc.data();
          labels.push(data.name);
          votes.push(data.votes);
        });

        setVoteData({
          labels,
          datasets: [{
            label: 'Votes',
            data: votes,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
          }]
        });
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Vote Distribution',
      },
    },
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>Vote Monitoring</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Bar data={voteData} options={options} />
          </Paper>
        </Grid>
        {/* Add more grid items for additional statistics or information */}
      </Grid>
    </div>
  );
};

export default VoteMonitoring;
