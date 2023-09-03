import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCreatedEvent, orderStatus } from "@23navi/btcommon";
import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../model/ticket";

const EXPIRATION_SECONDS = 60 * 15; // 15 min

async function setup() {
  const listener = new OrderCreatedListener(natsWrapper.client);
  const ticket = Ticket.build({
    title: "test_title",
    price: 50,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + EXPIRATION_SECONDS);

  const data: OrderCreatedEvent["data"] = {
    version: 0,
    status: orderStatus.Created,
    expiresAt: expiration.toISOString(),
    id: new mongoose.Types.ObjectId().toHexString(), //order Id
    userId: ticket.userId,
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, ticket, data, msg };
}

it("update the orderId of the ticket", async () => {
  const { listener, data, ticket, msg } = await setup();
  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);
  console.log({ updatedTicket });
});

it("acks the message after updating the ticket orderId", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
