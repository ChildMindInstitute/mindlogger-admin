import { ModalProps } from 'shared/components';
import { CreatedEvent } from 'api';

export type TakeNowModalProps = Partial<Pick<ModalProps, 'onClose'>>;

export type EventsData = {
  result: CreatedEvent[];
  count: number;
};
