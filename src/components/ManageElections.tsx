import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { doc, updateDoc, addDoc, collection, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { Button, Typography, Snackbar, TextField, IconButton, Grid, Card, CardContent, CardActions, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

const ManageElections: React.FC = () => {
  const [elections, setElections] = useState<any[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchElections = async () => {
      const electionsSnapshot = await getDocs(collection(db, 'elections'));
      setElections(electionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchElections();
  }, []);

  const activateElection = async (id: string) => {
    try {
      const activeElectionsQuery = query(collection(db, 'elections'), where('status', '==', 'active'));
      const activeElectionsSnapshot = await getDocs(activeElectionsQuery);

      activeElectionsSnapshot.forEach(async (doc) => {
        await updateDoc(doc.ref, { status: 'inactive' });
      });

      const electionRef = doc(db, 'elections', id);
      await updateDoc(electionRef, { status: 'active' });

      setSnackbarMessage('Election activated successfully!');
    } catch (error) {
      console.error('Error activating election:', error);
      setSnackbarMessage('Error activating election. Please try again.');
    }
    setSnackbarOpen(true);
  };

  const handleAddOrUpdateElection = async () => {
    if (!title || !startDate || !endDate || !description) {
      setSnackbarMessage('Please fill in all fields.');
      setSnackbarOpen(true);
      return;
    }

    try {
      if (editingId) {
        const electionRef = doc(db, 'elections', editingId);
        await updateDoc(electionRef, { title, startDate, endDate, description });
        setSnackbarMessage('Election updated successfully!');
        setEditingId(null);
      } else {
        const electionsCollection = collection(db, 'elections');
        await addDoc(electionsCollection, { title, startDate, endDate, description, status: 'inactive' });
        setSnackbarMessage('Election added successfully!');
      }
      setTitle('');
      setStartDate('');
      setEndDate('');
      setDescription('');
      setOpenDialog(false); // Close the dialog after adding/updating
      const electionsSnapshot = await getDocs(collection(db, 'elections'));
      setElections(electionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error adding/updating election:', error);
      setSnackbarMessage('Error adding/updating election. Please try again.');
    }
    setSnackbarOpen(true);
  };

  const handleDeleteElection = async (id: string) => {
    try {
      const electionRef = doc(db, 'elections', id);
      await deleteDoc(electionRef);
      setElections(elections.filter(election => election.id !== id));
      setSnackbarMessage('Election deleted successfully!');
    } catch (error) {
      console.error('Error deleting election:', error);
      setSnackbarMessage('Error deleting election. Please try again.');
    }
    setSnackbarOpen(true);
  };

  const handleEditElection = (election: any) => {
    setTitle(election.title);
    setStartDate(election.startDate);
    setEndDate(election.endDate);
    setDescription(election.description);
    setEditingId(election.id);
    setOpenDialog(true); // Open the dialog for editing
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Manage Elections</Typography>
      <Button 
        variant="contained" 
        color="primary" 
        startIcon={<AddIcon />} 
        onClick={() => setOpenDialog(true)}
        style={{ marginBottom: '20px' }}
      >
        Add New Election
      </Button>
      <Grid container spacing={3}>
        {elections.map(election => (
          <Grid item xs={12} sm={6} md={4} key={election.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{election.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Start: {new Date(election.startDate).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  End: {new Date(election.endDate).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Status: {election.status}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color={election.status === 'active' ? 'secondary' : 'primary'}
                  onClick={() => activateElection(election.id)}
                >
                  {election.status === 'active' ? 'Deactivate' : 'Activate'}
                </Button>
                <IconButton size="small" onClick={() => handleEditElection(election)}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" onClick={() => handleDeleteElection(election.id)}>
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editingId ? 'Edit Election' : 'Add New Election'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Start Date"
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="End Date"
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddOrUpdateElection} color="primary">
            {editingId ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </div>
  );
};

export default ManageElections;
