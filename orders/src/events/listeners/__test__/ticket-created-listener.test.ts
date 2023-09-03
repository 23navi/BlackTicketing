import { ITicketCreatedEvent } from "@23navi/btcommon";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { TicketCreatedListener } from "../ticket-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../model/ticket";

async function setup() {
  const listener = new TicketCreatedListener(natsWrapper.client);
  const data: ITicketCreatedEvent["data"] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "test_title",
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg };
}

it("create and save a ticket", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  const createdTicket = await Ticket.findById(data.id);
  expect(createdTicket).toBeDefined();
  expect(createdTicket!.title).toEqual(data.title);
  expect(createdTicket!.price).toEqual(data.price);
  expect(createdTicket!.version).toEqual(0);
  expect(createdTicket!.id).toEqual(data.id);
});

it("acks the message after successfully saving a ticket", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
