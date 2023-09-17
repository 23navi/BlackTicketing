import { ExpirationCompletedEvent, orderStatus } from "@23navi/btcommon";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../model/ticket";
import { ExpirationCompleteListener } from "../expiration-completed-listener";
import { Order } from "../../../model/order";

const EXPIRATION_SECONDS = 60 * 15; // 15 min

async function setup() {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + EXPIRATION_SECONDS);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "test_title",
    price: 50,
  });

  await ticket.save();

  const order = Order.build({
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: expiration,
    status: orderStatus.Created,
    ticket,
  });

  await order.save();

  const data: ExpirationCompletedEvent["data"] = {
    orderId: order.id,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg };
}

it("Updates the order to have status as cancelled", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  const updatedOrder = await Order.findById(data.orderId);
  expect(updatedOrder?.status)?.toEqual("cancelled");
});

it("acks the message after successfully updating and publishing the event", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
