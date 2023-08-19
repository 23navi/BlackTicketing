import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

// It is called stan bec of community convention... the better name would be "client", which allows to connect to nats streaming server from nodejs
const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  console.log("Publisher connected to NATS");

  const data = {
    id: "123",
    title: "abc",
    price: 123,
    userId: "123",
  };

  const publisher = new TicketCreatedPublisher(stan);
  try {
    console.log("this is running");
    await publisher.publish(data);
    console.log("this is also runnings");
  } catch (err) {
    console.error(err);
  }

  // stan.publish("ticket:created", data, () => {
  //   console.log("Event published");
  // });
});
