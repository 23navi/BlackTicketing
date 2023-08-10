import request from "supertest";
import { app } from "../../app";

import { Ticket } from "../../model/ticket";

it("has a route handler listening to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).not.toEqual(404);
});
it("can only be accessed if the user is signed in", async () => {
  const response = await request(app).post("/api/tickets").send({}).expect(401);
});
it("returns a status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({});
  expect(response.status).not.toEqual(401);
});
it("returns an error if an invalid title is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "",
      price: 50,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: ["jsldfj"],
      price: 50,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      price: 50,
    })
    .expect(400);
});
it("returns an error if an invalid price is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "abc",
    })
    .expect(400);
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "abc",
      // Here "15" is working even "15" is string and our expressValidator only allows float... Auto type convertion?
      price: "15a",
    })
    .expect(400);
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "abc",
      price: [],
    })
    .expect(400);
});
it("create a ticket with valid inputs", async () => {
  // Number of tickets in db should be 0 on start
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  // Creating a new ticket
  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "abc",
      price: 15,
    })
    .expect(201);

  // Number of tickets in db should be 1 after the ticket is created
  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(15);
  expect(tickets[0].title).toEqual("abc");
  expect(tickets[0].id).toBeDefined();
  expect(tickets[0].userId).toBeDefined();
});
