import mongoose from "mongoose";

import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");

    console.log("Auth Service: Connected to MongoDb");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  app.listen(3000, () => {
    console.log("Auth Service: Listening on port 3000!");
  });
};

start();
