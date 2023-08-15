import nats from "node-nats-streaming";

// It is called stan bec of community convention... the better name would be "client", which allows to connect to nats streaming server from nodejs
const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Publisher connected to NATS");

  const data = JSON.stringify({
    id: "123",
    title: "abc",
    price: 123,
  });

  stan.publish("ticket:created", data, () => {
    console.log("Event published");
  });
});


