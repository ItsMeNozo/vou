import { Request, Response } from 'express';
import Event from '../models/event';

interface Controller {
  create: (req: Request, res: Response) => void;
  events: (req: Request, res: Response) => void;
  getEventById: (req: Request, res: Response) => void;
  searchEventsByName: (req: Request, res: Response) => void;
  filterEvents: (req: Request, res: Response) => void;
  getEventTimesToday: (req: Request, res: Response) => void;
  countEvents: (req: Request, res: Response) => void;
}

interface filterFields {
  game?: string;
  status?: string;
  startDate?: Date;
}

const controller: Controller = {
  create: async (req: Request, res: Response) => {
    try {
      const event = new Event(req.body);
      await event.save();
      event.id = event._id;
      await event.save();
      res.status(201).send(event);
    } catch (error) {
      res.status(400).send(error);
    }
  },

  events: async (req: Request, res: Response) => {
    try {
      const events = await Event.find();
      res.status(200).send(events);
    } catch (error) {
      res.status(500).send(error);
    }
  },

  getEventById: async (req: Request, res: Response) => {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) {
        return res.status(404).send({ message: 'Event not found' });
      }
      res.status(200).send(event);
    } catch (error) {
      res.status(500).send(error);
    }
  },

  searchEventsByName: async (req: Request, res: Response) => {
    try {
      const name = req.query.input as string;
      const events = await Event.find({ name: new RegExp(name, 'i') });
      res.status(200).send(events);
    } catch (error) {
      res.status(500).send(error);
    }
  },

  filterEvents: async (req: Request, res: Response) => {
    try {
      const { game, status, 'start-time': startTime } = req.query;
      const filter: filterFields = {};

      if (game) {
        filter.game = game as string;
      }

      if (status) {
        filter.status = status as string;
      }

      if (startTime) {
        const startDate = new Date(startTime as string);
        filter.startDate = startDate;
      }

      const events = await Event.find(filter);
      res.status(200).send(events);
    } catch (error) {
      res.status(500).send(error);
    }
  },

  getEventTimesToday: async (req: Request, res: Response) => {
    try {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const events = await Event.find({
        $or: [
          { game: "quiz", startDate: { $gte: now, $lte: endOfDay } },
          { status: "happening" }
        ]
      }).select('startDate');

      const startTimes = events
        .map(event => event.startDate)
        .sort((a, b) => {
          if (a && b) {
            return a.getTime() - b.getTime();
          }
          return 0;
        });

      res.status(200).send(startTimes);
    } catch (error) {
      res.status(500).send(error);
    }
  },


  countEvents: async (req: Request, res: Response) => {
    try {
      const { game } = req.query;
      let count;

      if (game) {
        count = await Event.countDocuments({ game: game as string });
      } else {
        count = await Event.countDocuments();
      }

      res.status(200).send({ count });
    } catch (error) {
      res.status(500).send(error);
    }
  }
};

export default controller;
