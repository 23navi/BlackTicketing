import { Subjects } from "./subjects";
import { orderStatus } from "./types/order-status.enum";

export interface OrderCreatedEvent {
  subject: Subjects.OrderCreated;
  data: {
    id: string; //order id
    status: orderStatus.Created;
    userId: string; //user id
    expiresAt: string; //expiration date
    ticket: {
      id: string; //ticket id
      price: number;
    };
  };
}
