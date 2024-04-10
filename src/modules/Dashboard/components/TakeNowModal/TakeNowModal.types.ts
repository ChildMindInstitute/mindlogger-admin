import { ModalProps } from 'shared/components';

import { CreatedEvent } from '../../api';

export type TakeNowModalProps = Pick<ModalProps, 'onClose'>;

export type EventsData = {
  result: CreatedEvent[];
  count: number;
};
