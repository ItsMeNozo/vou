import mongoose, { Schema } from "mongoose";

const eventSchema = new Schema({
	id: { type: Schema.Types.ObjectId, },
	name: { type: String, },
	brand: { type: String, },
	description: { type: String, },
	imgUrl: { type: String, },
	game: { type: String, },
	status: { type: String, },
	startDate: { type: Date, },
	endDate: { type: Date, },
	vouchers: [{
		voucher: { type: Schema.Types.ObjectId, ref: "Voucher" },
		quantity: { type: Number, },
		available: { type: Number, },
	}],
})

const Event = mongoose.model("Event", eventSchema);
export default Event;
