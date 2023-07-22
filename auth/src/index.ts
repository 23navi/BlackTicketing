import express from "express";
import { json } from "body-parser";
import mongoose from "mongoose";

import "express-async-errors";

import { currentUserRouter } from "./routers/current-user.router";
import { signinRouter } from "./routers/signin.router";
import { signupRouter } from "./routers/signup.router";
import { signoutRouter } from "./routers/signout.router";

import { errorHandler } from "./middleware/error-handler";
import { RouteNotFoundError } from "./errors/route-not-found-error";

const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);

app.all("*", (req, res) => {
  throw new RouteNotFoundError();
});

app.use(errorHandler);

const startup = async () => {
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
  }
  app.listen(3000, () => {
    console.log("Listening on port 3000 for the auth service");
  });
};

startup();
