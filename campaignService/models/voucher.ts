import mongoose, { Schema } from "mongoose";

const voucherSchema = new Schema({
	id: { type: Schema.Types.ObjectId, },
	event: { type: Schema.Types.ObjectId, ref: "Event" },
	name: { type: String, },
	description: { type: String, },
	imgUrl: { type: String, },
	code: { type: String, },
	qrCode: { type: String, },
	value: { type: Number, },
	status: { type: String, },
	redeemMethod: { type: String, },
	expiryDate: { type: Date, },
})

const Voucher = mongoose.model("Voucher", voucherSchema);
export default Voucher;
