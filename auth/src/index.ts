import express from "express";
import { json } from "body-parser";

const app = express();
app.use(json());

app.get("/api/users/:value", (req, res) => {
  res.send("Hi there");
});

app.get("*", (req, res) => {
  console.log("this is reached");
  res.send("yooo");
});

app.listen(3000, () => {
  console.log("Listening on port 3000 for the auth service");
});
