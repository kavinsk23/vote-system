import React, { useState } from 'react';
import { Modal, Button, TextField, MenuItem } from '@mui/material';

interface AddCandidateModalProps {
  open: boolean;
  handleClose: () => void;
  handleAddCandidate: (candidate: { name: string; party: string; photoUrl: string; electionId: string }) => void;
  elections: { id: string; title: string }[]; // Add elections prop
}

const AddCandidateModal: React.FC<AddCandidateModalProps> = ({ open, handleClose, handleAddCandidate, elections }) => {
    const [name, setName] = useState('');
    const [party, setParty] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');
    const [electionId, setElectionId] = useState('');

    const handleSubmit = () => {
        if (name && party && photoUrl && electionId) {
            handleAddCandidate({ name, party, photoUrl, electionId });
            handleClose();
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px' }}>
                <h2>Add Candidate</h2>
                <TextField 
                    label="Name" 
                    fullWidth 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                />
                <TextField 
                    label="Party" 
                    fullWidth 
                    value={party} 
                    onChange={(e) => setParty(e.target.value)} 
                />
                <TextField 
                    label="Photo URL" 
                    fullWidth 
                    value={photoUrl} 
                    onChange={(e) => setPhotoUrl(e.target.value)} 
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
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Add Candidate
                </Button>
            </div>
        </Modal>
    );
};

export default AddCandidateModal;
