import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

import { Ticket } from "../../model/ticket";

it("returns a 404 if the provide ticket is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app)
    .post(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  // handled by requiredAuth middleware

  // Not passing the cookie here..
  const id = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app).post(`/api/tickets/${id}`).expect(404);
});

it("returns a 401 if the user does not own the ticket", async () => {
  // handled by us by comparing and thorwing NotAuthorizedError()

  const createdTicket = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "test-user1",
      price: 50,
    })
    .expect(201);

  const ticketId = createdTicket.body.id;

  const response = await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set("Cookie", global.signin())
    .send({
      title: "test-user2",
      price: 50,
    })
    .expect(401);
});

it("returns a 400 if the user provides an invalid title or price", async () => {
  // handled by express-validator
  const cookie = global.signin();

  const createdTicket = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "test-user1",
      price: 50,
    })
    .expect(201);

  const ticketId = createdTicket.body.id;

  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 50,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set("Cookie", cookie)
    .send({
      title: "valid",
      price: "invalid",
    })
    .expect(400);
});

it("returns 200 is the ticket is updated successfully", async () => {
  // Happy case.. is all the test cases covered

  const cookie = global.signin();

  const createdTicket = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "test-user1",
      price: 50,
    })
    .expect(201);

  const ticketId = createdTicket.body.id;

  const response = await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set("Cookie", cookie)
    .send({
      title: "valid",
      price: 70,
    })
    .expect(200);

  expect(response.body.title).toEqual("valid");
  expect(response.body.price).toEqual(70);
});
