import { BaseListener, NotFoundError, Subjects } from "@23navi/btcommon";
import { OrderCreatedEvent } from "@23navi/btcommon";
import { Message } from "node-nats-streaming";
import QUEUEGROUPNAME from "./queue-group-name";
import { expirationQueue } from "../../queue/expiration-queue";
export class OrderCreatedListener extends BaseListener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = QUEUEGROUPNAME;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    console.log("Event data on Create from expiration service! ", data);

    // Ack the message after saving the ticket
    expirationQueue.add({ orderId: data.id });
    msg.ack();
  }
}
