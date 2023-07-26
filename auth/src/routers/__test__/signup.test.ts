import request from "supertest";

import { app } from "../../app";

it("returns a 201 on successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "navisureka23@gmail.com",
      password: "Navi2308",
    })
    .expect(201);
});

//Multi test
it("returns a 400 if email or password is missing", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "navisureka23@gmail.com",
    })
    .expect(400);

  await request(app)
    .post("/api/users/signup")
    .send({
      password: "navisureka",
    })
    .expect(400);
});

// Duplicate email

it("returns a 400 if duplicate email is used", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "navisureka23@gmail.com",
      password: "Navii",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "navisureka23@gmail.com",
      password: "Navii",
    })
    .expect(400);
});
