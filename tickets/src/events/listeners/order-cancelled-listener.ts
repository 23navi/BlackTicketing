import { BaseListener, Subjects } from "@23navi/btcommon";
import { OrderCancelledEvent } from "@23navi/btcommon";
import { Message } from "node-nats-streaming";
import QUEUEGROUPNAME from "./queue-group-name";

export class OrderCreatedListener extends BaseListener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = QUEUEGROUPNAME;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    console.log("Event data on Create! ", data);

    //     msg.ack();
  }
}
