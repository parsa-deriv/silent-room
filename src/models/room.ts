import { IDGen } from "../services/id_generator";

export class Room {
  id: string;
  name: string;
  capacity: number;
  isTaken: boolean = false;
  busyTimes: Date[] = [];

  constructor(
    name: string,
    capacity: number,
    isTaken: boolean = false,
    busyTimes: Date[] = []
  ) {
    this.id = IDGen.newId();
    this.name = name;
    this.capacity = capacity;
  }
}
