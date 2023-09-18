import {
  BaseListener,
  Subjects,
  NotFoundError,
  orderStatus,
} from "@23navi/btcommon";
import { OrderCancelledEvent } from "@23navi/btcommon";
import { Message } from "node-nats-streaming";
import QUEUEGROUPNAME from "./queue-group-name";
import { Order } from "../../models/orders";

// On order:cancelled event, we will update the order status to cancelled.

export class OrderCancelledListener extends BaseListener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = QUEUEGROUPNAME;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    console.log("Event data on Order Cancelled! ", data);

    // 1 find the order with order id in data
    const order = await Order.findOne({
      id: data.id,
      version: data.version - 1,
    });

    // 2 if no order, throw error..
    if (!order) {
      throw new NotFoundError();
    }

    //3 Update the order status to cancelled
    order.set({ status: orderStatus.Cancelled });

    //4 Save the order
    await order.save();

    // Ack the message after saving the ticket and publishing the event
    msg.ack();
  }
}
