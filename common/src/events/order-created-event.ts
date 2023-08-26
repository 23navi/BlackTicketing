import { Subjects } from "./subjects";
import { orderStatus } from "./types/order-status.enum";

// update the OrderCreatedEvent interface to name to IOrderCreatedEvent
export interface OrderCreatedEvent {
  subject: Subjects.OrderCreated;
  data: {
    id: string; //order id
    version: number;
    status: orderStatus.Created;
    userId: string; //user id
    expiresAt: string; //expiration date
    ticket: {
      id: string; //ticket id
      price: number;
    };
  };
}
