import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for API requests
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import classes from "./InventoryPopup.module.css";
import inventoryImg from "@/assets/game/inventory.png";

const InventoryPopup: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [showGiftDialog, setShowGiftDialog] = useState(false);
  const [giftDetails, setGiftDetails] = useState({ phone: '', email: '', userId: '' });
  const [inventory, setInventory] = useState<any[]>([]); // Ensure the default is an array
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track errors

  // Fetch player inventory when the pop-up is opened
  const fetchInventory = async () => {
    try {
      const response = await axios.get('http://localhost:3005/api/player/vSYRZLEJQxuE6WZH3CC2/inventory'); // Example API endpoint

      if (response.data && response.data.items) {
        const items = Object.keys(response.data.items).map(key => ({
          name: key,
          amount: response.data.items[key].amount
        }));
        setInventory(items); // Convert the object to an array
      } else {
        setInventory([]); // Set an empty array if no items
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      setIsLoading(false);
    }
  };

  // Fetch inventory when the component loads
  useEffect(() => {
    fetchInventory();
  }, []);

  // Handle exchange
  const handleExchange = async () => {
    // Required items for the exchange
    const requiredItems = {
      cat: 2,
      panda: 1,
      rabbit: 1
    };
  
    // Check if player has enough items
    const hasEnoughItems = inventory.every(item => {
      if (item.name === 'cat' && item.amount < requiredItems.cat) return false;
      if (item.name === 'panda' && item.amount < requiredItems.panda) return false;
      if (item.name === 'rabbit' && item.amount < requiredItems.rabbit) return false;
      return true;
    });
  
    if (!hasEnoughItems) {
      // Notify the user if they don't have enough items
      alert("You don't have enough items to exchange for the voucher.");
      return; // Exit the function to prevent sending the request
    }
  
    // If player has enough items, proceed with the exchange request
    try {
      const response = await axios.post('http://localhost:3005/api/exchange', {
        playerId: "vSYRZLEJQxuE6WZH3CC2", // Replace with actual player ID
        selectedItems: requiredItems
      });
  
      // Refresh the inventory after successful exchange
      await fetchInventory();
  
      // Notify the user with the response message
      alert(response.data.message); // For example: "Exchange successful"
    } catch (error) {
      console.error("Error exchanging items:", error);
      alert("There was an error during the exchange.");
    }
  };
  
  const handleItemClick = (item: string) => {
    setSelectedItem(item); // Highlight the selected item
  };

  const handleSendGift = async () => {
    const giftInfo = {
      senderId: 'vSYRZLEJQxuE6WZH3CC2', // Replace with actual user ID
      item: selectedItem,
      recipientUsername: giftDetails.userId,
      
    };

    try {
      // Send gift API call
      await axios.post('http://localhost:3005/api/sendItem', giftInfo); // Example API endpoint for sending gifts
      console.log("Gift sent:", giftInfo);
      setShowGiftDialog(false);
      alert('Gift sent successfully!');
      // Refresh inventory after gift is sent
      await fetchInventory();
    } catch (error) {
      console.error("Error sending gift:", error);
    }
  };

  if (isLoading) {
    return <div>Loading inventory...</div>;
  }

  if (error) {
    return <div>Error loading inventory. Please try again later.</div>;
  }

  return (
    <Popover>
      <PopoverTrigger>
        <img src={inventoryImg} alt="inventory" className={classes.inventory_icon} width={24}/>
      </PopoverTrigger>
      <PopoverContent className={classes.popup_inner}>
        <h2>Item Collection</h2>
        <ul>
          {inventory.length > 0 ? (
            inventory.map((item, index) => (
              <li 
                key={index} 
                onClick={() => handleItemClick(item.name)} 
                className={selectedItem === item.name ? classes.selected_item : ""}
              >
                {item.name}: {item.amount} {item.name === 'cat' ? '/2' : '/1'}
              </li>
            ))
          ) : (
            <li>No items found in your inventory.</li>
          )}
        </ul>
        <div className={classes.actions}>
          <button 
            className={classes.mix_button} 
            onClick={handleExchange} // Call handleExchange here
            disabled={inventory.length === 0}  // Disable if no items in inventory
          >
            Mix Option: Get the voucher
          </button>
          <button 
            className={classes.gift_button} 
            onClick={() => setShowGiftDialog(true)} 
            disabled={!selectedItem}
          >
            Gift Option
          </button>
        </div>
        {showGiftDialog && (
          <div className={classes.gift_dialog}>
            <h3>Send Gift</h3>
            <input 
              type="text" 
              placeholder="User Name" 
              value={giftDetails.userId} 
              onChange={(e) => setGiftDetails({ ...giftDetails, userId: e.target.value })} 
            />
            <button className={classes.send_button} onClick={handleSendGift}>Send</button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default InventoryPopup;
