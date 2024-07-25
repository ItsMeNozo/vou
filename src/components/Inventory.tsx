import React, { useState } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, TextField, DialogActions, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import './Inventory.css';

const items = [
  { id: 1, name: 'Item 1', quantity: 10 },
  { id: 2, name: 'Item 2', quantity: 5 },
  { id: 3, name: 'Item 3', quantity: 7 },
];

const Inventory: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [giftDialogOpen, setGiftDialogOpen] = useState(false);
  const [recipientInfo, setRecipientInfo] = useState('');

  const handleGiftClick = (id: number) => {
    setSelectedItem(id);
    setGiftDialogOpen(true);
  };

  const handleSendGift = () => {
    console.log(`Sending ${selectedQuantity} of item ${selectedItem} to ${recipientInfo}`);
    // Record the gift details here
    setGiftDialogOpen(false);
    setRecipientInfo('');
    setSelectedQuantity(1);
  };

  return (
    <Box className="inventory-container">
      <Typography variant="h6">Item Collection</Typography>
      <List>
        {items.map((item) => (
          <ListItem key={item.id}>
            <ListItemText primary={`${item.name} (${item.quantity} available)`} />
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleGiftClick(item.id)}
              disabled={item.quantity === 0}
            >
              Gift
            </Button>
          </ListItem>
        ))}
      </List>
      <Button variant="contained" color="secondary" onClick={() => alert('Get the voucher')}>
        Mix
      </Button>

      <Dialog open={giftDialogOpen} onClose={() => setGiftDialogOpen(false)}>
        <DialogTitle>Gift Item</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Phone number, email, or user ID"
            fullWidth
            value={recipientInfo}
            onChange={(e) => setRecipientInfo(e.target.value)}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Quantity</InputLabel>
            <Select
              value={selectedQuantity}
              onChange={(e) => setSelectedQuantity(Number(e.target.value))}
              label="Quantity"
            >
              {[...Array(items.find(item => item.id === selectedItem)?.quantity || 0).keys()].map(i => (
                <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGiftDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSendGift} color="primary">
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Inventory;
