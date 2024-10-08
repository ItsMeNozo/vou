export enum VoucherStatus {
  ACTIVE = "active",
  EXPIRED = "expired",
  REDEEMED = "redeemed",
  PENDING = "pending",
  CANCELLED = "cancelled"
}

export enum RedeemMethod {
  Offline = 'Offline',
  Online = 'Online'
}

export default interface Voucher {
  QRCode: string;
  voucherCode: string;
  imgUrl: string;
  value: string;
  description: string;
  expiryDt: Date;
  status: VoucherStatus;
  redeemMethod: RedeemMethod;
  brand: string;
}