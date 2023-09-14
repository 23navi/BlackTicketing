import { BasePublisher, Subjects } from "@23navi/btcommon";
import { ExpirationCompletedEvent } from "@23navi/btcommon";

export class ExpirationCompletedEventPublisher extends BasePublisher<ExpirationCompletedEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
