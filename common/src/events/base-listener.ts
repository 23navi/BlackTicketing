import { Message, Stan, SubscriptionOptions } from "node-nats-streaming";

import IEvent from "./Event";

export abstract class BaseListener<T extends IEvent> {
  // private client: Stan;
  public abstract subject: T["subject"];
  public abstract queueGroupName: string;

  protected abstract onMessage(data: T["data"], msg: Message): void;

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

  parseMessage(msg: Message) {
    if (typeof msg.getData() === "string") {
      return JSON.parse(msg.getData() as string);
    }
    return JSON.parse(msg.getData().toString("utf-8"));
  }
}
