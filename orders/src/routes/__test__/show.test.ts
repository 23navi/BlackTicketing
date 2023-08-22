import request from "supertest";
import { app } from "../../app";

import { Ticket } from "../../model/ticket";

it("fetches the order", async () => {
  // 0) Create an user
  //1) create a ticket
  // 2) create an order with the ticket and user

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
    .get(`/api/orders/${body.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);
});
