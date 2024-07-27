import React from 'react';
import { useState } from 'react';
import { RiSearchLine } from 'react-icons/ri';
import { RiSearchFill } from 'react-icons/ri';
import { FaRegHeart } from 'react-icons/fa6';
import { FaHeart } from 'react-icons/fa6';
import { RiCoupon3Line } from 'react-icons/ri';
import { RiCoupon3Fill } from 'react-icons/ri';
import { IoNotificationsOutline } from 'react-icons/io5';
import { IoNotifications } from 'react-icons/io5';

const Navbar: React.FC = () => {
	const [selectedList, setSelectedList] = useState('Discover');

	const handleSelectList = (buttonName: string) => {
		setSelectedList(buttonName);
	};

	return (
		<div className='shadow-[0_-1px_4px_0_rgba(0,0,0,0.1)] h-16 bg-white flex fixed -bottom-1 left-0 w-full'>
			<button
				className={`grid gap-1 justify-items-center items-center flex-1 p-2 ${selectedList === 'Discover' ? ' text-[#7d4af9]' : ''}`}
				onClick={() => handleSelectList('Discover')}
			>
				{selectedList === 'Discover' ? <RiSearchFill className='text-xl stroke-1' /> : <RiSearchLine className='text-xl' />}
				<span className='text-sm'>Discover</span>
			</button>
			<button
				className={`grid gap-1 justify-items-center flex-1 p-2 ${selectedList === 'Favorite' ? 'text-[#7d4af9]' : ''}`}
				onClick={() => handleSelectList('Favorite')}
			>
				{selectedList === 'Favorite' ? <FaHeart className='text-xl' /> : <FaRegHeart className='text-xl' />}
				<span className='text-sm'>Favorite</span>
			</button>
			<button
				className={`grid gap-1 justify-items-center flex-1 p-2 ${selectedList === 'Voucher' ? 'text-[#7d4af9]' : ''}`}
				onClick={() => handleSelectList('Voucher')}
			>
				{selectedList === 'Voucher' ? <RiCoupon3Fill className='text-xl' /> : <RiCoupon3Line className='text-xl' />}
				<span className='text-sm'>Voucher</span>
			</button>
			<button
				className={`grid gap-1 justify-items-center flex-1 p-2 ${selectedList === 'Notification' ? 'text-[#7d4af9]' : ''}`}
				onClick={() => handleSelectList('Notification')}
			>
				{selectedList === 'Notification' ? <IoNotifications className='text-xl' /> : <IoNotificationsOutline className='text-xl' />}
				<span className='text-sm'>Notification</span>
			</button>
		</div>
	);
};

export default Navbar;
