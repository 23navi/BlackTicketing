import { BasePublisher } from "@23navi/btcommon";
import { Subjects } from "@23navi/btcommon";
import { ITicketUpdatedEvent } from "@23navi/btcommon";

export class TicketUpdatedPublisher extends BasePublisher<ITicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
