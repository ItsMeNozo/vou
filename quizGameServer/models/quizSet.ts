import mongoose, { Schema } from "mongoose";

const quizSetSchema = new Schema({
  eventId: { type: Schema.Types.ObjectId, ref: "Event", },
  quizzes: [{
    question: { type: String, },
    answers: [{ type: String, }],
    correct: { type: Number, },
  }],
})

const QuizSet = mongoose.model("QuizSet", quizSetSchema);
export default QuizSet;
