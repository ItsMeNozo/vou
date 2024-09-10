interface Voucher {
  voucherId: string;
  eventId: string;
  code: string;
  qrCode: string;
  imgUrl: string;
  value: string;
  description: string;
  expiryDt: Date;
  status: string;
  redeemMethod: string;
  quantity: number;
  remainings: number;
}

export default Voucher;
