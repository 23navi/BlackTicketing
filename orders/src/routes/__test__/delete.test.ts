import request from "supertest";
import { app } from "../../app";

import { Ticket } from "../../model/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("Updated the status of ticket to cancelled", async () => {
  const user = global.signin();

  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });
  ticket.save();

  const { body } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const response = await request(app)
    .delete(`/api/orders/${body.id}`)
    .set("Cookie", user)
    .send()
    .expect(202);

  expect(response.body.status).toEqual("cancelled");
});

it("emits an order cancelled event", async () => {
  const user = global.signin();

  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });
  ticket.save();

  const { body } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const response = await request(app)
    .delete(`/api/orders/${body.id}`)
    .set("Cookie", user)
    .send()
    .expect(202);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
