import express from "express";
import { json } from "body-parser";

import { currentUserRouter } from "./routers/current-user.router";
import { signinRouter } from "./routers/signin.router";
import { signupRouter } from "./routers/signup.router";
import { signoutRouter } from "./routers/signout.router";

import { errorHandler } from "./middleware/error-handler";

const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);
app.use(errorHandler);

app.get("*", (req, res) => {
  console.log("this is reached");
  res.send("yooo");
});

app.listen(3000, () => {
  console.log("Listening on port 3000 for the auth service");
});
