import { Subjects } from "./subjects";

export interface OrderCancelledEvent {
  subject: Subjects.OrderCancelled;
  data: {
    id: string; //order id
    ticket: {
      id: string; //ticket id
    };
  };
}
