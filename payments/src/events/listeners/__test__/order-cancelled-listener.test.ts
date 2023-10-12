import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCancelledEvent, orderStatus } from "@23navi/btcommon";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Order } from "../../../models/orders";

async function setup() {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: orderStatus.Created,
    price: 500,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
  });
  await order.save();

  // The event data will have the order details which we are creating mock for.
  const data: OrderCancelledEvent["data"] = {
    version: 0,
    id: order.id, //order Id
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg };
}

it("update the order status to cancelled` ", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(data.id);
  expect(updatedOrder!.status).toEqual(orderStatus.Cancelled);
});

it("acks the message after updating the order status", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
