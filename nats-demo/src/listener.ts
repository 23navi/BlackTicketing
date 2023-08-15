import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedListener } from "./events/ticket-created-listener";

// It is called stan bec of community convention... the better name would be "client", which allows to connect to nats streaming server from nodejs
const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  stan.on("close", () => {
    console.log("NATS connection closed!");
    process.exit();
  });

  new TicketCreatedListener(stan).listen();
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());

// Creating abstract class for listener
