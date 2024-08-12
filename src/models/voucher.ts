interface Voucher {
    id: string;
    event: string;
    name: string;
    description: string;
    imgUrl: string;
    code: string;
    qrCode: string;
    value: number;
    status: string;
    redeemMethod: string[];
    expiryDate: Date;
}

export default Voucher;