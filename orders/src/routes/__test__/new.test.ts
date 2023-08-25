import request from "supertest";
import { app } from "../../app";

import { Ticket } from "../../model/ticket";
import { Order } from "../../model/order";
import { orderStatus } from "@23navi/btcommon";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";

it("should work!", () => {});

it("returns an error if ticket does not exist", async () => {
  const ticketId = new mongoose.Types.ObjectId();
  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId })
    .expect(404);
});

it("returns an error if ticket is already reserved", async () => {
  // First we will create a ticket then create an order for that ticket and finally test with a new order that should give an error
  const ticket = await Ticket.build({
    title: "concert",
    price: 20,
  }).save();

  const order = Order.build({
    ticket,
    userId: "12345",
    status: orderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  // Now testing that we should get error if we try to create a new order for a ticket that is already reserved

  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("create a new order", async () => {
  const ticket = await Ticket.build({
    title: "concert",
    price: 20,
  }).save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id });
  //     .expect(201);
});

it("emits an order created event", async () => {
  const ticket = await Ticket.build({
    title: "concert",
    price: 20,
  }).save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
