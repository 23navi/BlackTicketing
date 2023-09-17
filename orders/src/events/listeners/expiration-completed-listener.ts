import { BaseListener, Subjects, orderStatus } from "@23navi/btcommon";
import { ExpirationCompletedEvent } from "@23navi/btcommon";
import { Message } from "node-nats-streaming";
import QUEUEGROUPNAME from "./queue-group-name";
import { Order } from "../../model/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompleteListener extends BaseListener<ExpirationCompletedEvent> {
  readonly subject = Subjects.ExpirationComplete;
  queueGroupName = QUEUEGROUPNAME;

  async onMessage(data: ExpirationCompletedEvent["data"], msg: Message) {
    console.log("Event data on Expiration complete! ", data);

    const order = await Order.findById(data.orderId).populate("ticket");
    try {
      if (!order) {
        console.log("Order not found!???");
      }
      order?.set({ status: orderStatus.Cancelled });
      await order?.save();
    } catch (err) {
      console.log("Something went wrong on updating the order");
    }

    try {
      await new OrderCancelledPublisher(this.client).publish({
        id: order?.id!,
        version: order!.version,
        ticket: { id: order?.ticket.id },
      });
    } catch (err) {
      console.log(
        "Something went wrong in publishing the order cancelled event"
      );
    }
    // Publish a order cancelled event

    msg.ack();
  }
}
