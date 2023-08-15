import nats, { Stan } from "node-nats-streaming";

import IEvent from "./Event";

export abstract class BasePublisher<T extends IEvent> {
  public abstract subject: T["subject"];

  constructor(private client: Stan) {}

  //   public abstract data: T["data"];

  publish(data: T["data"]) {
    this.client.publish(this.subject, JSON.stringify(data)),
      () => {
        console.log("Event published");
      };
  }
}
