import { BasePublisher, Subjects } from "@23navi/btcommon";
import { OrderCreatedEvent } from "@23navi/btcommon";

export class TicketCreatedPublisher extends BasePublisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
