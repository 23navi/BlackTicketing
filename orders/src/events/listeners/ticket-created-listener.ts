import { BaseListener, Subjects } from "@23navi/btcommon";
import { ITicketCreatedEvent } from "@23navi/btcommon";
import { Message } from "node-nats-streaming";
import QUEUEGROUPNAME from "./queue-group-name";
import { Ticket } from "../../model/ticket";

export class TicketCreatedListener extends BaseListener<ITicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = QUEUEGROUPNAME;

  async onMessage(data: ITicketCreatedEvent["data"], msg: Message) {
    console.log("Event data on Create! ", data);

    const ticket = Ticket.build({
      id: data.id,
      price: data.price,
      title: data.title,
    });
    await ticket.save();

    msg.ack();
  }
}
