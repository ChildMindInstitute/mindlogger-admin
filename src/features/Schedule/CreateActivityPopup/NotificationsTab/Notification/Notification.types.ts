import { SendNotification } from '../../CreateActivityPopup.types';

export enum NotificationTimeType {
  timeAt = 'timeAt',
  timeFrom = 'timeFrom',
  timeTo = 'timeTo',
}

export type NotificationProps = SendNotification & { index: number };
