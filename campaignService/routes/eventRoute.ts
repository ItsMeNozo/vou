import express from "express";
import controller from "../controllers/eventController";

const router = express.Router();

router.post("/create", controller.create);
router.get("/search", controller.searchEventsByName);
router.get("/filter", controller.filterEvents);
router.get("/count", controller.countEvents);
router.get("/event-times-today", controller.getEventTimesToday);
router.get("/", controller.events);
router.get("/:id", controller.getEventById);


export default router;
