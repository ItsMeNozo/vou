// src/components/NotificationBell.tsx
import React, { useState } from 'react';
import { Box, IconButton, Button, Typography, List, ListItem, ListItemText, Paper } from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import './NotificationBell.css';

const notifications = [
  {
    id: 1,
    type: 'gift',
    message: 'You received a gift',
    actionText: 'Accept',
  },
  {
    id: 2,
    type: 'attempt',
    message: '...an attempt',
    actionText: 'Accept',
  },
  {
    id: 3,
    type: 'playRequest',
    message: 'Play request from Ngoc',
    actionText: 'Give',
  },
];

const NotificationBell: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleActionClick = (id: number) => {
    console.log(`Action clicked for notification id: ${id}`);
    // Handle action here (e.g., accept gift, give play request, etc.)
  };

  return (
    <Box className="notification-container">
      <IconButton color="primary" onClick={toggleNotifications}>
        <NotificationsIcon />
      </IconButton>
      {showNotifications && (
        <Paper className="notification-popup">
          <Typography variant="h6" className="notification-header">Thông báo</Typography>
          <List className="notification-list">
            {notifications.map((notification) => (
              <ListItem key={notification.id} className="notification-item">
                <ListItemText primary={notification.message} />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleActionClick(notification.id)}
                >
                  {notification.actionText}
                </Button>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default NotificationBell;
