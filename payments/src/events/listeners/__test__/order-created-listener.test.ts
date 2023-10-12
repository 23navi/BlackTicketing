import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCreatedEvent, orderStatus } from "@23navi/btcommon";
import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Order } from "../../../models/orders";

async function setup() {
  const listener = new OrderCreatedListener(natsWrapper.client);

  // The event data will have the order details which we are creating mock for.
  const data: OrderCreatedEvent["data"] = {
    version: 0,
    status: orderStatus.Created,
    expiresAt: new Date().toISOString(),
    id: new mongoose.Types.ObjectId().toHexString(), //order Id
    userId: new mongoose.Types.ObjectId().toHexString(),
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
      price: 500,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg };
}

it("created an order entry in db", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order).toBeDefined();

  expect(order!.price).toEqual(data.ticket.price);
  expect(order!.userId).toEqual(data.userId);
  expect(order!.status).toEqual(data.status);
  expect(order!.version).toEqual(data.version);
  expect(order!.id).toEqual(data.id);
});

it("acks the message after creating the order entry in db", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});

// it("publishes an event when ticket is updated on OrderCreated", async () => {
//   const { listener, data, msg } = await setup();
//   await listener.onMessage(data, msg);

//   expect(natsWrapper.client.publish).toHaveBeenCalled();

//   const ticketUpdatedData = JSON.parse(
//     (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
//   );

//   expect(data.id).toEqual(ticketUpdatedData.orderId);
// });
