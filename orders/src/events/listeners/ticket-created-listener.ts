import { BaseListener, Subjects } from "@23navi/btcommon";
import { ITicketCreatedEvent } from "@23navi/btcommon";
import { Message } from "node-nats-streaming";

export class TicketCreatedListener extends BaseListener<ITicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = "orders-service";

  onMessage(data: ITicketCreatedEvent["data"], msg: Message) {
    console.log("Event data on Create! ", data);
    msg.ack();
  }
}
