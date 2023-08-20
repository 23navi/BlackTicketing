import mongoose from "mongoose";

import { natsWrapper } from "./nats-wrapper";

import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  try {
    await mongoose.connect("mongodb://tickets-mongo-srv:27017/tickets");

    console.log("Ticket Service: Connected to MongoDb");
  } catch (err) {
    console.log("Cannot connect to MongoDb from Tickets service");
    console.error(err);
  }
  try {
    await natsWrapper.connect(
      "ticketing",
      "ajlfkjslkfj",
      "http://nats-srv:4222"
    );
    console.log("Ticket Service: Connected to Nats");
    natsWrapper.client.on("close", () => {
      console.log("Nats connection closed in Ticket Service");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());
  } catch (err) {
    console.log("Cannot connect to Nats in Ticket Service");
    // console.error(err);
  }

  app.listen(3000, () => {
    console.log("Ticket Service: Listening on port 3000!");
  });
};

start();
