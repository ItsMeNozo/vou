import { useState } from "react";
import { MdArrowBackIos } from "react-icons/md";
import QRCode from 'react-qr-code';
import voucherImgUrl from '@/assets/500k.png';
import { useNavigate } from "react-router-dom";

interface VoucherDetailsProps {
}

enum VoucherStatus {
  Expired = 'Expired',
  Ongoing = 'Ongoing'
}

enum RedeemMethod {
  Offline = 'Offline',
  Online = 'Online'
}

interface Voucher {
  QRCode: string;
  voucherCode: string;
  imgUrl: string;
  value: string;
  description: string;
  expiryDt: Date;
  status: VoucherStatus;
  redeemMethod: RedeemMethod;
}

const defaultVoucher: Voucher = {
  QRCode: "111222333444",
  voucherCode: "111222333444",
  imgUrl: voucherImgUrl,
  value: '100000',
  description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus fuga neque illo hic eligendi ea explicabo delectus, libero veniam quasi aspernatur voluptates consectetur distinctio praesentium tempora fugiat recusandae reiciendis asperiores!',
  expiryDt: new Date("2025-03-03"),
  status: VoucherStatus.Ongoing,
  redeemMethod: RedeemMethod.Online
}

const VoucherDetails: React.FC<VoucherDetailsProps> = () => {
  const navigate = useNavigate();
  const [voucher, setVoucher] = useState<Voucher>(defaultVoucher)

  return (
    <div className=' bg-slate-200 mb-16'>
      <div className="absolute p-2 top-6 left-6 rounded-full bg-zinc-400 bg-opacity-75 flex flex-col justify-center items-center "
        onClick={() => navigate(-1)}
      >
        <MdArrowBackIos className="text-center" />
      </div>

      <div className="w-full h-[300px] bg-white">
        <img src={voucher.imgUrl} className="w-full h-full object-contain" />
      </div>

      <div className=" h-[300px] flex flex-col justify-center items-center bg-white mt-2 mx-2 rounded">
        <div className="p-5 rounded-xl bg-white text-center border-4 border-black">
          <QRCode
            value={voucher.QRCode}
            bgColor={'#FFFFFF'}
            fgColor={'#000000'}
            size={170}
          />
        </div>
        <div className="mt-3 font-bold">
          QR code: {voucher.QRCode}
        </div>

      </div>
      <div className="bg-white p-4 rounded shadow-md max-w-md mx-2 mt-2">
        <div className="flex justify-between border-b py-2">
          <span className="font-semibold">Voucher Code:</span>
          <span>{defaultVoucher.voucherCode}</span>
        </div>
        <div className="flex justify-between border-b py-2">
          <span className="font-semibold">Value:</span>
          <span>{defaultVoucher.value}</span>
        </div>
        <div className="flex justify-between border-b py-2">
          <span className="font-semibold">Expiry Date:</span>
          <span>{defaultVoucher.expiryDt.toLocaleDateString("en-GB")}</span>
        </div>
        <div className="flex justify-between border-b py-2">
          <span className="font-semibold">Status:</span>
          <span>{defaultVoucher.status}</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="font-semibold">Redeem Method:</span>
          <span>{defaultVoucher.redeemMethod}</span>
        </div>
      </div>
      <div className="bg-white mt-2 mx-2 p-4 text-left">
        <p className="text-xl font-bold mb-2">Description</p>
        <p className="text-sm">{voucher.description}</p>
      </div>
    </div>
  )
}

export default VoucherDetails;