import { Message, Stan, SubscriptionOptions } from "node-nats-streaming";

export abstract class BaseListener {
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
