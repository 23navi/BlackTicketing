import { BaseListener, Subjects } from "@23navi/btcommon";
import { ITicketUpdatedEvent } from "@23navi/btcommon";
import { Message } from "node-nats-streaming";

export class TicketUpdatedListener extends BaseListener<ITicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = "orders-service";

  onMessage(data: ITicketUpdatedEvent["data"], msg: Message) {
    console.log("Event data on Update! ", data);
    msg.ack();
  }
}
