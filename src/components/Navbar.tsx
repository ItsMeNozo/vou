import React from "react";
import { useState } from "react";
import { RiSearchLine } from "react-icons/ri";
import { RiSearchFill } from "react-icons/ri";
import { FaRegHeart } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa6";
import { RiCoupon3Line } from "react-icons/ri";
import { RiCoupon3Fill } from "react-icons/ri";
import { IoNotificationsOutline } from "react-icons/io5";
import { IoNotifications } from "react-icons/io5";
import { useNavigate  } from "react-router-dom";

enum NavItem {
  Discover = "/discover",
  Favorite = "/favorites",
  Voucher = "/voucher",
  Notification = "/notification",
}

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [selectedList, setSelectedList] = useState<NavItem>(NavItem.Discover);

  const handleSelectList = (navItem: NavItem) => {
    setSelectedList(navItem);
    navigate(navItem)
  };

  return (
    <div className="shadow-[0_-1px_4px_0_rgba(0,0,0,0.1)] h-16 bg-white flex fixed -bottom-1 left-0 w-full">
      <button
        className={`grid gap-1 justify-items-center items-center flex-1 p-2 ${selectedList === NavItem.Discover ? " text-[#7d4af9]" : ""}`}
        onClick={() => handleSelectList(NavItem.Discover)}
      >
        {selectedList === NavItem.Discover ? (
          <RiSearchFill className="text-xl stroke-1" />
        ) : (
          <RiSearchLine className="text-xl" />
        )}
        <span className="text-sm">Discover</span>
      </button>
      <button
        className={`grid gap-1 justify-items-center flex-1 p-2 ${selectedList === NavItem.Favorite ? "text-[#7d4af9]" : ""}`}
        onClick={() => handleSelectList(NavItem.Favorite)}
      >
        {selectedList === NavItem.Favorite ? (
          <FaHeart className="text-xl" />
        ) : (
          <FaRegHeart className="text-xl" />
        )}
        <span className="text-sm">Favorite</span>
      </button>
      <button
        className={`grid gap-1 justify-items-center flex-1 p-2 ${selectedList === NavItem.Voucher ? "text-[#7d4af9]" : ""}`}
        onClick={() => handleSelectList(NavItem.Voucher)}
      >
        {selectedList === NavItem.Voucher ? (
          <RiCoupon3Fill className="text-xl" />
        ) : (
          <RiCoupon3Line className="text-xl" />
        )}
        <span className="text-sm">Voucher</span>
      </button>
      <button
        className={`grid gap-1 justify-items-center flex-1 p-2 ${selectedList === NavItem.Notification ? "text-[#7d4af9]" : ""}`}
        onClick={() => handleSelectList(NavItem.Notification)}
      >
        {selectedList === NavItem.Notification ? (
          <IoNotifications className="text-xl" />
        ) : (
          <IoNotificationsOutline className="text-xl" />
        )}
        <span className="text-sm">Notification</span>
      </button>
    </div>
  );
};

export default Navbar;
