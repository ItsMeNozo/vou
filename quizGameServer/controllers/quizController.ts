import { Request, Response } from 'express';
import axios from 'axios';
import QuizSet from '../models/quizSet';

interface Question {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

interface Controller {
  generate: (req: Request, res: Response) => void;
  getQuizSetById: (req: Request, res: Response) => void;
}

const controller: Controller = {
  generate: async (req: Request, res: Response) => {
    const eventId = req.query['event-id'];
    if (!eventId) {
      res.status(400).send('Event ID is required');
      return;
    }
    try {
      const response = await axios.get('https://opentdb.com/api.php?amount=10&type=multiple');
      const quizzes = response.data.results.map((question: Question) => {
        const answers = [question.correct_answer, ...question.incorrect_answers];

        for (let i = answers.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [answers[i], answers[j]] = [answers[j], answers[i]];
        }

        const correctIndex = answers.indexOf(question.correct_answer);

        return {
          question: question.question,
          answers: answers,
          correct: correctIndex,
        };
      });

      const quizSet = new QuizSet({
        eventId,
        quizzes: quizzes,
      });

      await quizSet.save();
      res.status(200).send('Quizzes saved successfully');
    } catch (error) {
      res.status(500).send('Error fetching trivia questions');
    }
  },

  getQuizSetById: async (req: Request, res: Response) => {
    try {
      const quizSet = await QuizSet.findById(req.params.id);
      if (!quizSet) {
        return res.status(404).send({ message: 'Quiz set not found' });
      }
      res.status(200).send(quizSet);
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

export default controller;