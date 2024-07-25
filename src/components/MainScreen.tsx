import React, { useState } from 'react';
import { Box, Grid, IconButton, Typography, Button } from '@mui/material';
import { Notifications as NotificationsIcon, Archive as InventoryIcon, HelpOutline as HelpIcon } from '@mui/icons-material';
import NotificationBell from './Notificationbell';
import Inventory from './Inventory';
import './MainScreen.css';

const MainScreen: React.FC = () => {
  const [showInventory, setShowInventory] = useState(false);

  return (
    <Box className="main-screen">
      <Grid container spacing={2} justifyContent="flex-end" alignItems="center" className="top-right-icons">
        <Grid item>
          <NotificationBell />
        </Grid>
        <Grid item>
          <IconButton color="primary" onClick={() => setShowInventory(!showInventory)}>
            <InventoryIcon />
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton color="primary">
            <HelpIcon />
          </IconButton>
        </Grid>
      </Grid>
      {showInventory && <Inventory />}
      <Box className="content">
        <Typography variant="h1" className="title">Ngoc</Typography>
        <Typography variant="body1" className="subtitle">10 attempts</Typography>
        <Box className="game-section">
          <Box className="ball">Ball</Box>
          <Button variant="contained" color="primary">Play</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default MainScreen;
