import { BaseListener, Subjects, NotFoundError } from "@23navi/btcommon";
import { OrderCancelledEvent } from "@23navi/btcommon";
import { Message } from "node-nats-streaming";
import QUEUEGROUPNAME from "./queue-group-name";
import { Ticket } from "../../model/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends BaseListener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = QUEUEGROUPNAME;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    console.log("Event data on Order Cancelled! ", data);

    // 1 find the ticket with ticket id in data
    const ticket = await Ticket.findById(data.ticket.id);

    // 2 if no ticket, throw error
    if (!ticket) {
      throw new NotFoundError();
    }

    //3 Update the ticket with undefined to mark ticket as unreserved
    ticket.set({ orderId: undefined });

    //4 Save the ticket
    await ticket.save();

    console.log("Ticket unreserved on orderCancelled event in ticket service");

    // We have updated the ticket in ticket service, now to maintain consistency, we will have to publish an event to tell other services to update their local copy of ticket.

    // 5 publish the event (We have this.client as we made our BaseListener class this.client to be protected)
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId, // undefined
    });

    // Ack the message after saving the ticket and publishing the event
    msg.ack();
  }
}
