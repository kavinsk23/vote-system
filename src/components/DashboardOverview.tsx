import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { Typography, Grid } from '@mui/material';

const DashboardOverview: React.FC = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalVotes, setTotalVotes] = useState(0);
  const [activeElections, setActiveElections] = useState(0);

  useEffect(() => {
    const fetchMetrics = async () => {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const votesSnapshot = await getDocs(collection(db, 'votes'));
      const electionsSnapshot = await getDocs(collection(db, 'elections'));

      setTotalUsers(usersSnapshot.size);
      setTotalVotes(votesSnapshot.size);
      setActiveElections(electionsSnapshot.docs.filter(doc => doc.data().status).length);
    };

    fetchMetrics();
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={4}>
        <Typography variant="h6">Total Users: {totalUsers}</Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography variant="h6">Total Votes: {totalVotes}</Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography variant="h6">Active Elections: {activeElections}</Typography>
      </Grid>
    </Grid>
  );
};

export default DashboardOverview;
