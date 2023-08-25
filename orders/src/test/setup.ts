import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
  var signin: () => string[];
}
jest.mock("../nats-wrapper");

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "abc";
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  const mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  jest.clearAllMocks();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = () => {
  // create a jwt payload {id, email}
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: "n@vi.com",
  };

  //create a signed JWT (We have the key in the env setup above)
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session object {jwt: MY_JWT}

  const session = { jwt: token };

  // Turn that session into JSON

  const sessionJSON = JSON.stringify(session);

  //Take JSON and encode it as base64

  const base64 = Buffer.from(sessionJSON).toString("base64");

  //return a string thats the cookie with the encoded data

  const cookie = [`session=${base64}`];

  return cookie;
};
