import Voucher from "./voucher";

interface Event {
  eventId: string;
  eventName: string;
  brandName: string;
  description: string;
  imgUrl: string;
  gameType: string;
  startDt: Date;
  endDt: Date;
  status: string;
  vouchers: any[];
}

export default Event;
