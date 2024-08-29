import Voucher from './voucher';

interface Event {
    id: string;
    name: string;
    brand: string;
    description: string;
    imgUrl: string;
    game: string;
    status: string;
    startDate: Date;
    endDate: Date;
    vouchers: {
        voucher: Voucher;
        quantity: number;
        available: number;
    }[];
}

export default Event;