import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import classes from "./InventoryPopup.module.css";
import inventoryImg from "@/assets/game/inventory.png";
const InventoryPopup: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [showGiftDialog, setShowGiftDialog] = useState(false);
  const [giftDetails, setGiftDetails] = useState({ phone: '', email: '', userId: '' });

  const handleItemClick = (item: string) => {
    setSelectedItem(item);
  };

  const handleSendGift = () => {
    const giftInfo = {
      giverId: 'currentUserId', // Replace with actual user ID
      receiverInfo: giftDetails,
      itemId: selectedItem,
      gameId: 'currentGameId', // Replace with actual game ID
      timeOfGift: new Date().toISOString()
    };
    console.log(giftInfo); // Replace with actual gift sending logic
    setShowGiftDialog(false);
    alert('Gift sent successfully!');
  };

  return (
    <Popover>
      <PopoverTrigger>
        <img src={inventoryImg} alt="inventory" className={classes.inventory_icon} width={24}/>
      </PopoverTrigger>
      <PopoverContent className={classes.popup_inner}>
        <h2>Item Collection</h2>
        <ul>
          <li onClick={() => handleItemClick('item1')}>Item 1</li>
          <li onClick={() => handleItemClick('item2')}>Item 2</li>
          <li onClick={() => handleItemClick('item3')}>Item 3</li>
        </ul>
        <div className={classes.actions}>
          <button className={classes.mix_button} onClick={() => alert('You got the voucher! Game over.')}>Mix Option: Get the voucher</button>
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
              placeholder="Phone number" 
              value={giftDetails.phone} 
              onChange={(e) => setGiftDetails({ ...giftDetails, phone: e.target.value })} 
            />
            <input 
              type="text" 
              placeholder="Email" 
              value={giftDetails.email} 
              onChange={(e) => setGiftDetails({ ...giftDetails, email: e.target.value })} 
            />
            <input 
              type="text" 
              placeholder="User ID" 
              value={giftDetails.userId} 
              onChange={(e) => setGiftDetails({ ...giftDetails, userId: e.target.value })} 
            />
            <button onClick={handleSendGift}>Send</button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default InventoryPopup;
