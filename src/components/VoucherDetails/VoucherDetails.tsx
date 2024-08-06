import { useState } from "react";
import { MdArrowBackIos } from "react-icons/md";
import QRCode from 'react-qr-code';

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
  imgUrl: './500k.png',
  value: '100000',
  description: 'hiiiii',
  expiryDt: new Date("2025-03-03"),
  status: VoucherStatus.Ongoing,
  redeemMethod: RedeemMethod.Online
} 

const VoucherDetails: React.FC<VoucherDetailsProps> = () => {
  const [voucher, setVoucher] = useState<Voucher>(defaultVoucher)

  return (
    <div className='flex flex-col overflow-scroll'>
      <div className="absolute top-6 left-6">
        <MdArrowBackIos className="h-6 w-6 hover:cursor-pointer" />
      </div>
      
      <div className="w-full h">
        <img src={voucher.imgUrl} className="h-5" />
      </div>

      <div className="flex flex-row flex-1">
        <div className="w-1/2">
          <h3></h3>
        </div>

        <div className="flex flex-col justify-center w-1/2 items-center">
          <QRCode
            value={voucher.QRCode}
            bgColor={'#FFFFFF'}
            fgColor={'#000000'}
            size={50}
          />
          <div>
            QR code: {voucher.QRCode}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VoucherDetails;