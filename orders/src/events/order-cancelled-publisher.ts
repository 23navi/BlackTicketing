import { BasePublisher, Subjects } from "@23navi/btcommon";
import { OrderCancelledEvent } from "@23navi/btcommon";

export class OrderCancelledPublisher extends BasePublisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
