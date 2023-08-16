import { BasePublisher } from "@23navi/btcommon";
import { Subjects } from "@23navi/btcommon";
import { ITicketCreatedEvent } from "@23navi/btcommon";

export class TicketCreatedPublisher extends BasePublisher<ITicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
