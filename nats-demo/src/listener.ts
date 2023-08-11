import nats, { Message, Stan, SubscriptionOptions } from "node-nats-streaming";
import { randomBytes } from "crypto";

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

  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    .setDurableName("accounting-service");

  const subscription = stan.subscribe(
    "ticket:created",
    // "my-queue-group-1",
    options
  );

  subscription.on("message", (msg: any) => {
    console.log(
      `Message received with sequence number ${msg.getSequence()}. Data: ${msg.getData()} `
    );
    msg.ack();
  });
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());

// Creating abstract class for listener

abstract class BaseListener {
  // private client: Stan;
  public abstract subject: string;
  public abstract queueGroupName: string;

  protected abstract onMessage(data: any, msg: Message): void;

  constructor(private client: Stan) {}

  subscriptionOptions(): SubscriptionOptions {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setDurableName(this.queueGroupName);
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on("message", (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message): string {
    if (typeof msg.getData() === "string") {
      return msg.getData() as string;
    }
    return JSON.parse(msg.getData().toString("utf-8"));
  }
}
