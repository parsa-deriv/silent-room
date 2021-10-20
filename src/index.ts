import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";

import { Room } from "./models/room";
import { RequestValidationError } from "./errors/request_validation_error";
import { errorHandler } from "./middlewares/error_handler";

const app = express();
app.use(express.json());

const rooms: Room[] = [];

app.get("/rooms", (req: Request, res: Response) => {
  res.send(rooms);
});

app.post(
  "/rooms",
  [body("name").notEmpty(), body("capacity").isNumeric().notEmpty()],
  (req: Request, res: Response) => {
    console.log("dfdsfsd");
    if (!validationResult(req).isEmpty()) {
      throw new RequestValidationError("Some fields are missing", 401);
    }
    console.log("Passed errors");
    let newRoom = new Room(req.body.name, req.body.capacity);
    rooms.push(newRoom);
    res.status(201).json({ result: true, room: newRoom });
    console.log("Sent room");
  }
);

app.post(
  "/reserve",
  [
    body("id").notEmpty(),
    body("from").notEmpty().isISO8601(),
    body("to").notEmpty().isISO8601(),
  ],
  (req: Request, res: Response) => {}
);

app.use(errorHandler);

const start = async () => {
  const PORT = process.env.PORT || 2000;

  app.listen(PORT, () => {
    console.log("Server is running on port");
  });
};

start();
