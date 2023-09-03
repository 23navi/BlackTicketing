import { BaseListener, Subjects } from "@23navi/btcommon";
import { OrderCreatedEvent } from "@23navi/btcommon";
import { Message } from "node-nats-streaming";
import QUEUEGROUPNAME from "./queue-group-name";

export class OrderCreatedListener extends BaseListener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = QUEUEGROUPNAME;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    console.log("Event data on Create! ", data);

    //     msg.ack();
  }
}
