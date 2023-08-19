import mongoose from "mongoose";

import { natsWrapper } from "./nats-wrapper";

import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  try {
    await natsWrapper.connect("ticketing", "abc", "http://nats-srv:4222");

    await mongoose.connect("mongodb://tickets-mongo-srv:27017/tickets");

    console.log("Ticket Service: Connected to MongoDb");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("Ticket Service: Listening on port 3000!");
  });
};

start();
