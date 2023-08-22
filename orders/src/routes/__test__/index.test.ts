import request from "supertest";
import { app } from "../../app";

import { Ticket } from "../../model/ticket";

// helper function to create a ticket

const createTicket = async (title?: string, price?: number) => {
  const ticket = Ticket.build({
    title: title || "abc",
    price: price || 20,
  });
  return ticket.save();
};

it("fetch orders for a particular user", async () => {
  // We will make 3 different tickets
  // We will make 2 different users (user1 and user2)
  // We will make 1 order for each ticket... (user1 -> order for ticket1 , user2 -> order for ticket2 and ticket3)

  const ticket1 = await createTicket("tic1");
  const ticket2 = await createTicket("tic2");
  const ticket3 = await createTicket("tic3");

  const user1 = global.signin();
  const user2 = global.signin();

  // Create an order as user 1
  await request(app)
    .post("/api/orders")
    .set("Cookie", user1)
    .send({ ticketId: ticket1.id });

  // Create an order as user 2 (1)
  await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({ ticketId: ticket2.id });

  // Create an order as user 2 (2)
  await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({ ticketId: ticket3.id });

  const response1 = await request(app)
    .get("/api/orders")
    .set("Cookie", user1)
    .send();
  expect(response1.body.length).toEqual(1);

  const response2 = await request(app)
    .get("/api/orders")
    .set("Cookie", user2)
    .send();

  expect(response2.body.length).toEqual(2);
});
