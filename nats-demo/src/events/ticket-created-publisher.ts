import { BasePublisher } from "./base-publisher";
import { Subjects } from "./subjects";
import ITicketCreatedEvent from "./ticket-created-event";

export class TicketCreatedPublisher extends BasePublisher<ITicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
