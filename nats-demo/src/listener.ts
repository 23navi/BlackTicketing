import nats from "node-nats-streaming";

// It is called stan bec of community convention... the better name would be "client", which allows to connect to nats streaming server from nodejs
const stan = nats.connect("ticketing", "abcde", {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");
});
