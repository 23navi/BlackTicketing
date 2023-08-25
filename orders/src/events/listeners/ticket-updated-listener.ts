import { BaseListener, Subjects } from "@23navi/btcommon";
import { ITicketUpdatedEvent } from "@23navi/btcommon";
import { Message } from "node-nats-streaming";
import QUEUEGROUPNAME from "./queue-group-name";
import { Ticket } from "../../model/ticket";

export class TicketUpdatedListener extends BaseListener<ITicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = QUEUEGROUPNAME;

  async onMessage(data: ITicketUpdatedEvent["data"], msg: Message) {
    console.log("Event data on Update! ", data);
    const ticket = await Ticket.findOne({ id: data.id });
    if (!ticket) {
      return new Error("Ticket not found");
    }
    const { title, price } = data;
    ticket.set({ title, price });
    ticket.save();

    msg.ack();
  }
}
