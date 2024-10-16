import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { Button, List, ListItem, ListItemText, Typography, Select, MenuItem, FormControl, InputLabel, Paper, Grid } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { CSVLink } from 'react-csv';

const ElectionResults: React.FC = () => {
  const [elections, setElections] = useState<any[]>([]);
  const [selectedElection, setSelectedElection] = useState<string>('');
  const [candidates, setCandidates] = useState<any[]>([]);

  useEffect(() => {
    const fetchElections = async () => {
      const electionsQuery = query(collection(db, 'elections'), orderBy('endDate', 'desc'));
      const electionsSnapshot = await getDocs(electionsQuery);
      setElections(electionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchElections();
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (selectedElection) { // Ensure selectedElection is defined
        const candidatesQuery = query(
          collection(db, 'candidates'), 
          where('electionId', '==', selectedElection),
          orderBy('votes', 'desc')
        );
        const candidatesSnapshot = await getDocs(candidatesQuery);
        setCandidates(candidatesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    };

    fetchResults();
  }, [selectedElection]);

  const chartData = {
    labels: candidates.map(candidate => candidate.name),
    datasets: [{
      data: candidates.map(candidate => candidate.votes),
      backgroundColor: candidates.map(() => `#${Math.floor(Math.random()*16777215).toString(16)}`),
    }]
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Election Results Archive</Typography>
      <FormControl fullWidth style={{ marginBottom: '20px' }}>
        <InputLabel>Select Election</InputLabel>
        <Select
          value={selectedElection}
          onChange={(e) => setSelectedElection(e.target.value as string)}
        >
          {elections.map(election => (
            <MenuItem key={election.id} value={election.id}>{election.title}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedElection && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: '20px' }}>
              <Typography variant="h6" gutterBottom>Vote Distribution</Typography>
              <Pie data={chartData} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: '20px' }}>
              <Typography variant="h6" gutterBottom>Candidate Results</Typography>
              <List>
                {candidates.map(candidate => (
                  <ListItem key={candidate.id}>
                    <ListItemText primary={candidate.name} secondary={`Votes: ${candidate.votes}`} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      )}
      <Button variant="contained" style={{ marginTop: '20px' }}>
        <CSVLink data={candidates} filename={`election_results_${selectedElection}.csv`}>Export as CSV</CSVLink>
      </Button>
    </div>
  );
};

export default ElectionResults;
