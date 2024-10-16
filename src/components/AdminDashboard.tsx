import React, { Suspense, useState } from 'react';
import { 
  Typography, 
  Box, 
  CircularProgress, 
  Paper, 
  AppBar, 
  Toolbar, 
  IconButton, 
  Drawer, 
  List, 
  ListItemButton,
  ListItemIcon, 
  ListItemText,
  useTheme,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import PersonIcon from '@mui/icons-material/Person';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PollIcon from '@mui/icons-material/Poll';
import BarChartIcon from '@mui/icons-material/BarChart';
import ManageCandidates from './ManageCandidates';
import ManageElections from './ManageElections';
import DashboardOverview from './DashboardOverview';
import UserManagement from './UserManagement';
import ElectionResults from './ElectionResults';
import VoteMonitoring from './VoteMonitoring';
import ElectionStatistics from './ElectionStatistics';
import './admin.css'; // Import the CSS file

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    setDrawerOpen(false);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const tabItems = [
    { label: "Overview", icon: <DashboardIcon />, component: <DashboardOverview /> },
    { label: "Manage Candidates", icon: <PeopleIcon />, component: <ManageCandidates /> },
    { label: "Manage Elections", icon: <HowToVoteIcon />, component: <ManageElections /> },
    { label: "User Management", icon: <PersonIcon />, component: <UserManagement /> },
    { label: "Vote Monitoring", icon: <AssessmentIcon />, component: <VoteMonitoring /> },
    { label: "Election Results", icon: <PollIcon />, component: <ElectionResults /> },
    { label: "Election Statistics", icon: <BarChartIcon />, component: <ElectionStatistics /> },
  ];

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {tabItems.map((item, index) => (
          <ListItemButton key={item.label} onClick={() => handleTabChange(index)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Voting System Admin
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? drawerOpen : true}
        onClose={toggleDrawer}
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
        }}
      >
        {drawer}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Paper elevation={3} sx={{ p: 2 }}>
          <Suspense fallback={<CircularProgress />}>
            {tabItems[activeTab].component}
          </Suspense>
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
