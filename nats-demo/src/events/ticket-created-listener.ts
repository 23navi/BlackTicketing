import { BaseListener } from "@23navi/btcommon";

import { Message } from "node-nats-streaming";
import { ITicketCreatedEvent } from "@23navi/btcommon";
import { Subjects } from "@23navi/btcommon";

export class TicketCreatedListener extends BaseListener<ITicketCreatedEvent> {
  subject: ITicketCreatedEvent["subject"] = Subjects.TicketCreated;
  // subject: Subjects.TicketCreated = Subjects.TicketCreated;
  // readonly subject = Subjects.TicketCreated;
  queueGroupName = "payments-service";

  onMessage(data: ITicketCreatedEvent["data"], msg: Message) {
    console.log(data);
    console.log(typeof data);

    msg.ack();
  }
}
