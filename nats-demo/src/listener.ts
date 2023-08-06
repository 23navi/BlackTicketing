import nats from "node-nats-streaming";
import { randomBytes } from "crypto";

// It is called stan bec of community convention... the better name would be "client", which allows to connect to nats streaming server from nodejs
const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  const subscription = stan.subscribe("ticket:created", "my-queue-group-1");

  subscription.on("message", (msg: any) => {
    console.log(
      `Message received with sequence number ${msg.getSequence()}. Data: ${msg.getData()} `
    );
  });
});
