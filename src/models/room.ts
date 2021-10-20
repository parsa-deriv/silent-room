import { IDGen } from "../services/id_generator";
import { TimeSlot } from "./time_slot";
export class Room {
  id: string;
  name: string;
  capacity: number;
  isTaken: boolean = false;
  busyTimes: TimeSlot[] = [];

  constructor(
    name: string,
    capacity: number,
    isTaken: boolean = false,
    busyTimes: Date[] = []
  ) {
    this.id = IDGen.newId();
    this.name = name;
    this.capacity = capacity;

    Object.setPrototypeOf(this, Room.prototype);
  }

  canReserve(slot: TimeSlot) {
    for (let t of this.busyTimes) {
      if (slot.start <= t.start && t.start <= slot.end) return false; // b starts in a
      if (slot.start <= t.end && t.end <= slot.end) return false; // b ends in a
      if (t.start <= slot.start && slot.end <= t.end) return false; // a in b
    }
    console.log("Can reserve");
    return true;
  }

  reserve(slot: TimeSlot) {
    this.busyTimes.push(slot);
    console.log("Added reservation");
  }
}
