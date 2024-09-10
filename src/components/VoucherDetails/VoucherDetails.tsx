import { useState } from "react";
import { MdArrowBackIos } from "react-icons/md";
import QRCode from 'react-qr-code';
import { useNavigate, useLocation } from "react-router-dom";
import Voucher, { VoucherStatus, RedeemMethod } from "@/types/Voucher";


interface VoucherDetailsProps {
}

const VoucherDetails: React.FC<VoucherDetailsProps> = () => {
  const location = useLocation();
  // console.log(location.state); // Add this to check what's being passed

  // Access the passed voucher object from state
  const { voucherDetails, saleEvent } = location.state || {};


  if (!voucherDetails) {
    return <div>No voucher found</div>;
  }

  const navigate = useNavigate();
  const [voucher, setVoucher] = useState<any>(voucherDetails)

  return (
    <div className=' bg-slate-200 mb-16'>


      <div className="text-left p-4 sticky top-0 z-50 bg-white shadow-md flex flex-row">
        <div className=" flex flex-col justify-center items-center mr-2 "
          onClick={() => navigate(-1)}
        >
          <MdArrowBackIos className="text-center" />
        </div>
        <span className="text-left text-2xl font-bold">Voucher Details</span>
      </div>

      <div className="w-full h-[300px] bg-white">
        <img src={voucher.imgUrl} className="w-full h-full object-contain" />
      </div>

      <div className="bg-white mt-2 mx-2 p-4 text-left rounded">
        <p className="font-bold text-lg">{saleEvent.brandName}</p>
      </div>

      <div className=" h-[300px] flex flex-col justify-center items-center bg-white mt-2 mx-2 rounded">
        <div className="p-5 rounded-xl bg-white text-center border-4 border-black">
          <QRCode
            value={voucher.qrCode}
            bgColor={'#FFFFFF'}
            fgColor={'#000000'}
            size={170}
          />
        </div>
        <div className="mt-3 font-bold">
          QR code: {voucher.qrCode}
        </div>

      </div>
      <div className="bg-white p-4 rounded max-w-md mx-2 mt-2">
        <div className="flex justify-between border-b py-2">
          <span className="font-semibold">Voucher Code:</span>
          <span>{voucher.code}</span>
        </div>
        <div className="flex justify-between border-b py-2">
          <span className="font-semibold">Value:</span>
          <span>{voucher.value}</span>
        </div>
        <div className="flex justify-between border-b py-2">
          <span className="font-semibold">Expiry Date:</span>
          <span>{new Date(voucher.expiryDt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}</span>
        </div>
        {/* <div className="flex justify-between border-b py-2">
          <span className="font-semibold">Status:</span>
          <span>{voucher.status}</span>
        </div> */}
        <div className="flex justify-between py-2">
          <span className="font-semibold">Redeem Method:</span>
          <span>{voucher.redeemMethod}</span>
        </div>
      </div>
      <div className="bg-white mt-2 mx-2 p-4 text-left rounded">
        <p className="text-xl font-bold mb-2">Description</p>
        <p className="text-sm">{voucher.description}</p>
      </div>
    </div>
  )
}

export default VoucherDetails;