import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { ITicketUpdatedEvent } from "@23navi/btcommon";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../model/ticket";
import { TicketUpdatedListener } from "../ticket-updated-listener";

async function setup() {
  const listener = new TicketUpdatedListener(natsWrapper.client);
  const ticket1 = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "test_title",
    price: 10,
  });
  await ticket1.save();

  const data: ITicketUpdatedEvent["data"] = {
    version: ticket1.version + 1,
    id: ticket1.id,
    title: "updated_title",
    price: 50,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  const data2: ITicketUpdatedEvent["data"] = {
    version: 1,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "no_such_ticket_title",
    price: 50,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, ticket1, data, data2, msg };
}
it("find, update and saves a ticket", async () => {
  // update will happen when we call onMessage
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  const ticket = await Ticket.findById(data.id);
  console.log("Ticket from test ", ticket);
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
  expect(ticket!.version).toEqual(data.version);
  expect(ticket!.id).toEqual(data.id);
});

it("What will it do when ticket is not found?", async () => {
  // update will happen when we call onMessage
  const { listener, data2, msg } = await setup();
  await listener.onMessage(data2, msg);
  // for now it just logs ' This ticket was not processed and skipped'
  expect(msg.ack).not.toHaveBeenCalled();
});

it("acks the message after successfully updating a ticket", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
