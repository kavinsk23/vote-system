import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebaseConfig';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { TextField, Button, Grid, Card, CardContent, CardMedia, Dialog, DialogTitle, DialogContent, DialogActions, Typography, IconButton, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

interface Election {
  id: string;
  title: string;
  status: boolean;
}

const ManageCandidates: React.FC = () => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [elections, setElections] = useState<Election[]>([]);
  const [name, setName] = useState('');
  const [party, setParty] = useState('');
  const [position, setPosition] = useState('');
  const [bio, setBio] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [category, setCategory] = useState('');
  const [electionId, setElectionId] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchCandidates = async () => {
      const candidatesCollection = collection(db, 'candidates');
      const candidatesSnapshot = await getDocs(candidatesCollection);
      setCandidates(candidatesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const fetchActiveElections = async () => {
      const electionsCollection = collection(db, 'elections');
      const electionsSnapshot = await getDocs(electionsCollection);
      setElections(electionsSnapshot.docs.map(doc => {
        const data = doc.data() as Omit<Election, 'id'>; // Exclude 'id' from the spread
        return { id: doc.id, ...data };
      }).filter(election => election.status));
    };

    fetchCandidates();
    fetchActiveElections();
  }, []);

  const handleAddOrUpdateCandidate = async () => {
    if (!name || !party || !position || !bio || !photo || !category || !electionId) {
      alert('Please fill in all fields.');
      return;
    }

    let photoUrl = '';
    if (photo) {
      const photoRef = ref(storage, `candidates/${photo.name}`);
      await uploadBytes(photoRef, photo);
      photoUrl = await getDownloadURL(photoRef);
    }

    try {
      if (editingId) {
        const candidateRef = doc(db, 'candidates', editingId);
        await updateDoc(candidateRef, { name, party, position, bio, photoUrl, category, electionId });
        setEditingId(null);
      } else {
        const candidatesCollection = collection(db, 'candidates');
        await addDoc(candidatesCollection, { name, party, position, bio, photoUrl, category, electionId, votes: 0 });
      }
      setName('');
      setParty('');
      setPosition('');
      setBio('');
      setPhoto(null);
      setCategory('');
      setElectionId('');
      setOpenDialog(false); // Close the dialog after adding/updating
      const candidatesSnapshot = await getDocs(collection(db, 'candidates'));
      setCandidates(candidatesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error adding/updating candidate:', error);
      alert('Error adding/updating candidate. Please try again.');
    }
  };

  const handleDeleteCandidate = async (id: string) => {
    try {
      const candidateRef = doc(db, 'candidates', id);
      await deleteDoc(candidateRef);
      setCandidates(candidates.filter(candidate => candidate.id !== id));
    } catch (error) {
      console.error('Error deleting candidate:', error);
      alert('Error deleting candidate. Please try again.');
    }
  };

  const handleEditCandidate = (candidate: any) => {
    setName(candidate.name);
    setParty(candidate.party);
    setPosition(candidate.position);
    setBio(candidate.bio);
    setEditingId(candidate.id);
    setCategory(candidate.category);
    setElectionId(candidate.electionId);
    setOpenDialog(true); // Open the dialog for editing
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Manage Candidates</Typography>
      <Button 
        variant="contained" 
        color="primary" 
        startIcon={<AddIcon />} 
        onClick={() => setOpenDialog(true)}
        style={{ marginBottom: '20px' }}
      >
        Add New Candidate
      </Button>
      <Grid container spacing={3}>
        {candidates.map(candidate => (
          <Grid item xs={12} sm={6} md={4} key={candidate.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={candidate.photoUrl}
                alt={candidate.name}
              />
              <CardContent>
                <Typography variant="h6">{candidate.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Party: {candidate.party}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Position: {candidate.position}
                </Typography>
                <IconButton onClick={() => handleEditCandidate(candidate)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteCandidate(candidate.id)}>
                  <DeleteIcon />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editingId ? 'Edit Candidate' : 'Add New Candidate'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Party"
            value={party}
            onChange={(e) => setParty(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
          <TextField
            select
            label="Election"
            value={electionId}
            onChange={(e) => setElectionId(e.target.value)}
            fullWidth
            margin="normal"
          >
            {elections.map((election) => (
              <MenuItem key={election.id} value={election.id}>
                {election.title}
              </MenuItem>
            ))}
          </TextField>
          <input
            type="file"
            onChange={(e) => setPhoto(e.target.files?.[0] || null)}
            style={{ marginTop: '10px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddOrUpdateCandidate} color="primary">
            {editingId ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageCandidates;
