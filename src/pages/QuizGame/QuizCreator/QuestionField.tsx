import React from "react";

interface QuestionFieldProps {
  index: number;
  question: {
    question: string;
    answers: string[];
    correct: number;
  };
  updateQuestion: (
    index: number,
    updatedQuestion: {
      question: string;
      answers: string[];
      correct: number;
    },
  ) => void;
}

const QuestionField: React.FC<QuestionFieldProps> = ({
  index,
  question,
  updateQuestion,
}) => {
  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedQuestion = { ...question, question: e.target.value };
    updateQuestion(index, updatedQuestion);
  };

  const handleAnswerChange = (answerIndex: number, value: string) => {
    const updatedAnswers = [...question.answers];
    updatedAnswers[answerIndex] = value;
    const updatedQuestion = { ...question, answers: updatedAnswers };
    updateQuestion(index, updatedQuestion);
  };

  const handleCorrectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedQuestion = { ...question, correct: parseInt(e.target.value) };
    updateQuestion(index, updatedQuestion);
  };

  return (
    <div className="border p-4 rounded-md mb-4">
      <label className="block text-lg font-medium">Question {index + 1}</label>
      <input
        type="text"
        value={question.question}
        onChange={handleQuestionChange}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
      <br />
      {question.answers.map((answer, answerIndex) => (
        <div key={answerIndex}>
          <label className="block text-lg font-medium">
            Answer {answerIndex + 1}
          </label>
          <input
            type="text"
            value={answer}
            onChange={(e) => handleAnswerChange(answerIndex, e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <br />
        </div>
      ))}
      <label className="block text-lg font-medium">Correct Answer (1-4)</label>
      <input
        type="number"
        value={question.correct}
        onChange={handleCorrectChange}
        className="mt-1 block w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>
  );
};

export default QuestionField;
