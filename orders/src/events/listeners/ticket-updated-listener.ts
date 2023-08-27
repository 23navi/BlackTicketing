import { BaseListener, Subjects } from "@23navi/btcommon";
import { ITicketUpdatedEvent } from "@23navi/btcommon";
import { Message } from "node-nats-streaming";
import QUEUEGROUPNAME from "./queue-group-name";
import { Ticket } from "../../model/ticket";

export class TicketUpdatedListener extends BaseListener<ITicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = QUEUEGROUPNAME;

  async onMessage(data: ITicketUpdatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findByEvent(data);
    console.log({ ticket });
    if (!ticket) {
      // throw new Error("Ticket not found");   //This is making the service disconnect with NATS and then nothing will work?? //WTF is this... process.exit() is not restarting the service too!!!

      console.log("This ticket was not processed and skipped");
      return;
    }

    const { title, price } = data;
    ticket!.set({ title, price });
    console.log("Ran till here");
    // await ticket!.save();

    msg.ack();
    console.log("Ticket updated in orders services");
  }
}
