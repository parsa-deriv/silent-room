import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";

import { Room } from "./models/room";
import { RequestValidationError } from "./errors/request_validation_error";
import { errorHandler } from "./middlewares/error_handler";
import { TimeSlot } from "./models/time_slot";

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
    if (!validationResult(req).isEmpty()) {
      throw new RequestValidationError("Some fields are missing", 401);
    }

    let newRoom = new Room(req.body.name, req.body.capacity);
    rooms.push(newRoom);
    res.status(201).json({ result: true, room: newRoom });
  }
);

app.post(
  "/reserve",
  [
    body("roomId").notEmpty(),
    body("from").notEmpty().isISO8601(),
    body("to").notEmpty().isISO8601(),
  ],
  (req: Request, res: Response) => {
    if (!validationResult(req).isEmpty()) {
      throw new RequestValidationError("Some fields are missing", 401);
    }

    const roomId = req.body.roomId;
    const slot = new TimeSlot(
      new Date(Date.parse(req.body.from)),
      new Date(Date.parse(req.body.to))
    );

    if (slot.end <= slot.start) {
      throw new RequestValidationError("Provided times are not matching.", 401);
    }

    const room = rooms.find((r) => {
      return r.id == roomId;
    });

    if (!room) {
      return res.status(404).send("No room with the provided id");
    }

    if (!room.canReserve(slot)) {
      throw new RequestValidationError("Time overlap.", 401);
    }
    room.reserve(slot);

    res.send({ room });
  }
);

app.use(errorHandler);

const start = async () => {
  const PORT = process.env.PORT || 2000;

  app.listen(PORT, () => {
    console.log("Server is running on port");
  });
};

start();
