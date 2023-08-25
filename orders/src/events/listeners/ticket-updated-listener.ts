import { BaseListener, Subjects } from "@23navi/btcommon";
import { ITicketUpdatedEvent } from "@23navi/btcommon";
import { Message } from "node-nats-streaming";
import QUEUEGROUPNAME from "./queue-group-name";

export class TicketUpdatedListener extends BaseListener<ITicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = QUEUEGROUPNAME;

  onMessage(data: ITicketUpdatedEvent["data"], msg: Message) {
    console.log("Event data on Update! ", data);
    msg.ack();
  }
}
