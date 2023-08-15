import { BaseListener } from "./base-listener";

import { Message } from "node-nats-streaming";
import ITicketCreatedEvent from "./ticket-created-event";
import { Subjects } from "./subjects";

export class TicketCreatedListener extends BaseListener<ITicketCreatedEvent> {
  subject: ITicketCreatedEvent["subject"] = Subjects.TicketCreated;
  // subject: Subjects.TicketCreated = Subjects.TicketCreated;
  // readonly subject = Subjects.TicketCreated;
  queueGroupName = "payments-service";

  onMessage(data: ITicketCreatedEvent["data"], msg: Message) {
    console.log("Event data!", data.id);

    msg.ack();
  }
}
