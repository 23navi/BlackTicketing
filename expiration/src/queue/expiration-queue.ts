import Queue from "bull";
import { natsWrapper } from "../nats-wrapper";
import { ExpirationCompletedEventPublisher } from "../events/publishers/expiration-completed-publisher";

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  console.log({ job: job.data });
  try {
    console.log(
      "This here is working fine befor async to expiration:completed publisher"
    );
    await new ExpirationCompletedEventPublisher(natsWrapper.client).publish({
      orderId: job.data.orderId,
    });
    console.log(
      "This here is working fine after async to expiration:completed publisher"
    );
  } catch (err) {
    console.log("Something went wrong from expiration/queue/expiration");
    // console.log(err);
  }
});

export { expirationQueue };
