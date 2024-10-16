import React, { useState } from 'react';
import { db, storage } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { TextField, Button, Typography } from '@mui/material';
import './admin.css'; // Import the CSS file

const AddCandidate: React.FC = () => {
  const [name, setName] = useState('');
  const [party, setParty] = useState('');
  const [category, setCategory] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);

  const handleAddCandidate = async () => {
    if (!name || !party || !category || !photo) return;

    const photoRef = ref(storage, `candidates/${photo.name}`);
    await uploadBytes(photoRef, photo);
    const photoUrl = await getDownloadURL(photoRef);

    const candidatesCollection = collection(db, 'candidates');
    await addDoc(candidatesCollection, {
      name,
      party,
      category,
      photoUrl,
      votes: 0
    });

    setName('');
    setParty('');
    setCategory('');
    setPhoto(null);
  };

  return (
    <div className="admin-form">
      <Typography variant="h5" gutterBottom>Add/Edit Candidate</Typography>
      <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth margin="normal" />
      <TextField label="Party" value={party} onChange={(e) => setParty(e.target.value)} fullWidth margin="normal" />
      <TextField label="Category" value={category} onChange={(e) => setCategory(e.target.value)} fullWidth margin="normal" />
      <input type="file" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
      <Button variant="contained" className="admin-button" onClick={handleAddCandidate}>Add Candidate</Button>
    </div>
  );
};

export default AddCandidate;
