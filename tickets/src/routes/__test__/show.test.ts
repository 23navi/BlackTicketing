import request from "supertest";
import { app } from "../../app";

import { Ticket } from "../../model/ticket";

it("returns 404 if the ticket is not found", async () => {
  const id = "1234";
  const response = await request(app).get(`/api/tickets/${id}`).send();

  expect(response.status).toEqual(404);
});
it("returns the ticket if the ticket is found with status of 200", async () => {
  const title = "test";
  const price = 50;

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title,
      price,
    })
    .expect(201);

  if (!response.body.id) {
    throw new Error("Id was not returned");
  }

  const findTicketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .expect(200);

  expect(findTicketResponse.body.title).toEqual(title);
  expect(findTicketResponse.body.price).toEqual(price);
});
