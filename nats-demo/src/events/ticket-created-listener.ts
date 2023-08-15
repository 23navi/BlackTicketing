import { BaseListener } from "./base-listener";

import { Message, Stan } from "node-nats-streaming";

export class TicketCreatedListener extends BaseListener {
  subject = "ticket:created";
  queueGroupName = "payments-service";

  onMessage(data: any, msg: Message) {
    console.log("Event data!", data);

    msg.ack();
  }
}
