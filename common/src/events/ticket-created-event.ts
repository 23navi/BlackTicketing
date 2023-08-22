import IEvent from "./Event";
import { Subjects } from "./subjects";
export interface ITicketCreatedEvent extends IEvent {
  subject: Subjects.TicketCreated;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
  };
}