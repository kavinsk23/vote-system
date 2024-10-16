import React from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <Container maxWidth="md" style={{ textAlign: 'center', marginTop: '2rem' }}>
      <Typography variant="h3" gutterBottom>
        Welcome to the University Voting System
      </Typography>
      <Typography variant="h6" gutterBottom>
        Please login or register to participate in the elections.
      </Typography>
      <Box mt={4}>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/login"
          style={{ marginRight: '1rem' }}
        >
          Login
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          component={Link}
          to="/register"
        >
          Register
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
