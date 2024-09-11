import React, { useState, useEffect } from 'react';
import { GoArrowUp, GoArrowDown } from 'react-icons/go';
import { useNavigate } from "react-router-dom";
import { getVouchersOfUser } from "@/api/apiService"; // Import API service
import './VoucherList.css';
import { VoucherStatus } from '@/types/Voucher';

const VoucherList: React.FC = () => {
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState("Newest");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const username = "john_doe"; // You can dynamically fetch this from props or other logic

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const data = await getVouchersOfUser(username); // Fetch vouchers using username
        setVouchers(data.data); // Adjust according to your API response
        setLoading(false);
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchVouchers();
  }, [username]);

  const handleSelectVoucher = (voucher: any) => {
    navigate(`/voucher-details`, {
      state: { voucherDetails: voucher.voucher, saleEvent: voucher.voucher.saleEvent },
    });
  };

  const handleSelectSortButton = (buttonName: string) => {
    if (selectedOrder === buttonName) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSelectedOrder(buttonName);
      setSortOrder("asc");
    }
  };

  const renderIcon = (buttonName: string) => {
    if (selectedOrder === buttonName) {
      return sortOrder === "asc" ? (
        <GoArrowUp className="text-lg" />
      ) : (
        <GoArrowDown className="text-lg" />
      );
    }
    return null;
  };

  // Handle sorting by created date
  const handleSortByCreatedDt = () => {
    handleSelectSortButton("Newest");
    const sortedVouchers = [...vouchers].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    setVouchers(sortedVouchers);
  };

  // Handle sorting by voucher name
  const handleSortByName = () => {
    handleSelectSortButton("Name");
    const sortedVouchers = [...vouchers].sort((a, b) => {
      const nameA = a.voucher.saleEvent.eventName.toUpperCase();
      const nameB = b.voucher.saleEvent.eventName.toUpperCase();
      return sortOrder === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
    setVouchers(sortedVouchers);
  };

  // Handle sorting by expiry date
  const handleSortByExpiryDt = () => {
    handleSelectSortButton("Expiring");
    const sortedVouchers = [...vouchers].sort((a, b) => {
      const expiryA = new Date(a.voucher.expiryDt).getTime();
      const expiryB = new Date(b.voucher.expiryDt).getTime();
      return sortOrder === "asc" ? expiryA - expiryB : expiryB - expiryA;
    });
    setVouchers(sortedVouchers);
  };

  const getStatusStyle = (status: VoucherStatus) => {
    switch (status) {
      case VoucherStatus.ACTIVE:
        return "bg-green-100 text-green-800";
      case VoucherStatus.EXPIRED:
        return "bg-red-100 text-red-800";
      case VoucherStatus.REDEEMED:
        return "bg-blue-100 text-blue-800";
      case VoucherStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case VoucherStatus.CANCELLED:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <div className="mb-16">
        <div className="text-left p-4">
          <span className="text-left text-3xl font-bold">Vouchers</span>
        </div>

        <div className="bg-white flex border-b sticky top-0 z-50">
          <button
            className={`flex justify-center items-center gap-1 flex-1 p-2 ${selectedOrder === "Newest" ? "text-[#7d4af9]" : ""}`}
            onClick={handleSortByCreatedDt}
          >
            Newest {renderIcon("Newest")}
          </button>
          <button
            className={`flex justify-center items-center gap-1 flex-1 p-2 ${selectedOrder === "Name" ? "text-[#7d4af9]" : ""}`}
            onClick={handleSortByName}
          >
            Name {renderIcon("Name")}
          </button>
          <button
            className={`flex justify-center items-center gap-1 flex-1 p-2 ${selectedOrder === "Expiring" ? "text-[#7d4af9]" : ""}`}
            onClick={handleSortByExpiryDt}
          >
            Expiring {renderIcon("Expiring")}
          </button>
        </div>

        <div className="bg-slate-50">
          {loading ? (
            <div>Loading vouchers...</div>
          ) : error ? (
            <div>Error: {error}</div>
          ) : vouchers.length === 0 ? (
            <div>No vouchers available</div>
          ) : (
            vouchers.map((voucher, index) => (
              <div
                key={index}
                className="bg-white m-2 flex pr-2 border border-slate-300 relative rounded-sm"
                onClick={() => handleSelectVoucher(voucher)}
              >
                <div className="w-1/3 flex items-center border-r-2 border-slate-200 border-dashed relative">
                  <img
                    src={voucher.voucher.imgUrl}
                    className="max-h-40 h-full w-full object-cover"
                  />
                </div>
                <div className="py-2 w-2/3 pl-2 text-left">
                  <div>
                    <div className="mb-1 font-medium line-clamp-2">
                      {voucher.voucher.description}
                    </div>
                    <div className="mb-2 line-clamp-1 text-sm">
                      {voucher.voucher.saleEvent.eventName}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(voucher.status)}`}>
                    {voucher.status.toUpperCase()} {/* Capitalizes the first letter */}
                  </span>
                  <div className="text-[#7d4af9] text-sm">
                    Expired:{" "}
                    {new Date(voucher.voucher.expiryDt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default VoucherList;
