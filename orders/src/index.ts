import mongoose from "mongoose";
import { natsWrapper } from "./nats-wrapper";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener";

import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL must be defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }

  try {
    // await mongoose.connect("mongodb://orders-mongo-srv:27017/orders");
    await mongoose.connect(process.env.MONGO_URL!);
    console.log("Orders Service: Connected to MongoDb");
  } catch (err) {
    console.log("Cannot connect to MongoDb from Orders service");
    // console.error(err);
  }
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID!,
      process.env.NATS_CLIENT_ID!,
      process.env.NATS_URL!
    );
    console.log("Orders Service: Connected to Nats");
    natsWrapper.client.on("close", () => {
      console.log("Nats connection closed in Orders Service");
      process.exit(1);
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    //Listeners
    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
  } catch (err) {
    console.log("Cannot connect to Nats in Orders Service");
    process.exit(1);
  }

  app.listen(3000, () => {
    console.log("Orders Service: Listening on port 3000!");
  });
};

start();
