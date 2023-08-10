import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

import { Ticket } from "../../model/ticket";

it("returns a 404 if the provide ticket is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app).post(`/api/tickets/${id}`).expect(404);
});
