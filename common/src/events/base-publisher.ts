import nats, { Stan } from "node-nats-streaming";

import IEvent from "./Event";

export abstract class BasePublisher<T extends IEvent> {
  public abstract subject: T["subject"];

  constructor(private client: Stan) {}

  //   public abstract data: T["data"];

  publish(data: T["data"]): Promise<string> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) {
          return reject(err);
        }
        console.log("Event published to subject", this.subject);
        resolve("abc");
      });
    });
  }
}
