// For exporting `app` so that it can be used by both index.ts and supertest for testing

import express from "express";
import { json } from "body-parser";

import cookieSession from "cookie-session";

import "express-async-errors";

import { currentUserRouter } from "./routers/current-user.router";
import { signinRouter } from "./routers/signin.router";
import { signupRouter } from "./routers/signup.router";
import { signoutRouter } from "./routers/signout.router";

import { errorHandler } from "./middlewares/error-handler";
import { RouteNotFoundError } from "./errors/route-not-found-error";

const app = express();
app.set("trust proxy", true);
app.use(json());

app.use(cookieSession({ signed: false, secure: true }));

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);

app.all("*", (req, res) => {
  throw new RouteNotFoundError();
});

app.use(errorHandler);

export { app };
