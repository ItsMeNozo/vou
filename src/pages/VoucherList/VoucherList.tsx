import React, { useState } from 'react';
import { GoArrowUp, GoArrowDown } from 'react-icons/go';
import { useNavigate  } from "react-router-dom";
import './VoucherList.css';

const vouchers = [
  // description, condition, voucherCode, qrCode, expiryDate, status
  {
    description: "Get $10 off your next purchase at Cool Drinks Inc.",
    brand: "Cool Drinks Inc.",
    expired: "2024-12-31T23:59:59Z",
    imageURL:
      "https://i.pinimg.com/originals/d9/95/a3/d995a3d4637c2d04b2b5acfc43640a2d.png",
    redeemMethod: ["Online", "Offline"],
  },
  {
    description: "Get $10 off your next purchase at Cool Drinks Inc.",
    brand: "Cool Drinks Inc.",
    expired: "2024-12-31T23:59:59Z",
    imageURL:
      "https://i.pinimg.com/originals/d9/95/a3/d995a3d4637c2d04b2b5acfc43640a2d.png",
    redeemMethod: ["Online", "Offline"],
  },
  {
    description: "Get $10 off your next purchase at Cool Drinks Inc.",
    brand: "Cool Drinks Inc.",
    expired: "2024-12-31T23:59:59Z",
    imageURL:
      "https://i.pinimg.com/originals/d9/95/a3/d995a3d4637c2d04b2b5acfc43640a2d.png",
    redeemMethod: ["Online", "Offline"],
  },
  {
    description: "Get $10 off your next purchase at Cool Drinks Inc.",
    brand: "Cool Drinks Inc.",
    expired: "2024-12-31T23:59:59Z",
    imageURL:
      "https://i.pinimg.com/originals/d9/95/a3/d995a3d4637c2d04b2b5acfc43640a2d.png",
    redeemMethod: ["Online", "Offline"],
  },
  {
    description: "Get $10 off your next purchase at Cool Drinks Inc.",
    brand: "Cool Drinks Inc.",
    expired: "2024-12-31T23:59:59Z",
    imageURL:
      "https://i.pinimg.com/originals/d9/95/a3/d995a3d4637c2d04b2b5acfc43640a2d.png",
    redeemMethod: ["Online", "Offline"],
  },
];

const VoucherList: React.FC = () => {
	const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState("Newest");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSelectVoucher = () => {
		navigate("/voucher-details");
	}

  const handleSelectGame = (buttonName: string) => {
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

  return (
    <>
      <div className="mb-16">
        <div className="text-left p-4">
          <span className="text-left text-3xl font-bold">Vouchers</span>
        </div>
        {/* ---------------------------------------------------------------------- */}
        {/* Sort list */}
        <div className="bg-white flex border-b sticky top-0 z-50">
          <button
            className={`flex justify-center items-center gap-1 flex-1 p-2 ${selectedOrder === "Newest" ? "text-[#7d4af9]" : ""}`}
            onClick={() => handleSelectGame("Newest")}
          >
            Newest {renderIcon("Newest")}
          </button>
          <button
            className={`flex justify-center items-center gap-1 flex-1 p-2 ${selectedOrder === "Name" ? "text-[#7d4af9]" : ""}`}
            onClick={() => handleSelectGame("Name")}
          >
            Name {renderIcon("Name")}
          </button>
          <button
            className={`flex justify-center items-center gap-1 flex-1 p-2 ${selectedOrder === "Expiring" ? "text-[#7d4af9]" : ""}`}
            onClick={() => handleSelectGame("Expiring")}
          >
            Expiring {renderIcon("Expiring")}
          </button>
        </div>
        {/* ---------------------------------------------------------------------- */}
        {/* Voucher list */}
        <div className="bg-slate-50">
          {vouchers.map((voucher, index) => (
            <div
              key={index}
              className="bg-white m-2 flex pr-2 border border-slate-300 relative rounded-sm"
              onClick={handleSelectVoucher}
            >
              <div className="w-1/3 flex items-center border-r-2 border-slate-200 border-dashed relative">
                <img
                  src={voucher.imageURL}
                  className="max-h-40 h-full w-full object-cover"
                />
              </div>
              <div className="py-2 w-2/3 pl-2 text-left">
                <div>
                  <div className="mb-1 font-medium line-clamp-2">
                    {voucher.description}
                  </div>
                  <div className="mb-2 line-clamp-1 text-sm">
                    {voucher.brand}
                  </div>
                </div>
                <div className="mb-2 flex gap-1">
                  {voucher.redeemMethod.map((method, index) =>
                    method === "Online" ? (
                      <div
                        key={index}
                        className="text-sm bg-blue-400 text-white p-1 rounded-md mr-1"
                      >
                        {method}
                      </div>
                    ) : (
                      <div
                        key={index}
                        className="text-sm bg-yellow-400 p-1 rounded-md mr-1"
                      >
                        {method}
                      </div>
                    ),
                  )}
                </div>
                <div className="text-[#7d4af9] text-sm">
                  Expired:{" "}
                  {new Date(voucher.expired).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default VoucherList;
