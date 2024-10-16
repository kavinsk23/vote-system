import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Tooltip } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../contexts/AuthContext'; // We'll create this context

const Navbar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar 
      position="static" 
      sx={{
        backgroundColor: '#007bff', // Beautiful blue background
        boxShadow: '0 2px 4px rgba(0,0,0,.1)' // Subtle shadow
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton 
            color="inherit" 
            aria-label="home" 
            component={Link} 
            to="/"
            sx={{ marginRight: 2 }}
          >
            <HomeIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 'bold',
              letterSpacing: '3px',
              display: { xs: 'none', sm: 'block' } // Hide on extra small screens
            }}
          >
            E-Voting System
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
          <Tooltip title="Dashboard">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mx: 2 }}>
              <IconButton 
                color="inherit" 
                aria-label="dashboard"
                component={Link} 
                to="/dashboard"
              >
                <DashboardIcon />
              </IconButton>
              <Typography variant="caption">Dashboard</Typography>
            </Box>
          </Tooltip>
          <Tooltip title="Vote">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mx: 2 }}>
              <IconButton 
                color="inherit" 
                aria-label="vote"
                component={Link} 
                to="/vote"
              >
                <HowToVoteIcon />
              </IconButton>
              <Typography variant="caption">Vote</Typography>
            </Box>
          </Tooltip>
          <Tooltip title="Logout">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mx: 2 }}>
              <IconButton 
                color="inherit" 
                onClick={handleLogout} 
                aria-label="logout"
              >
                <LogoutIcon />
              </IconButton>
              <Typography variant="caption">Logout</Typography>
            </Box>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
