import * as yup from 'yup';

import i18n from 'i18n';
import { TimerType } from 'modules/Dashboard/api';
import { getIsRequiredValidateMessage } from 'shared/utils';

import { NotificationType } from './EventForm.types';

export const EventFormSchema = () => {
  const { t } = i18n;
  const activityRequired = t('activityRequired');
  const timerDurationCheck = t('timerDurationCheck');
  const selectValidPeriod = t('selectValidPeriod');

  const getTimeComparison = () =>
    yup.string().when('alwaysAvailable', {
      is: false,
      then: yup.string().test('is-valid-period', selectValidPeriod, function () {
        const { startTime, endTime } = this.parent;
        if (!startTime || !endTime) {
          return false;
        }
        const startDate = new Date(`2000-01-01T${startTime}:00`);
        const endDate = new Date(`2000-01-01T${endTime}:00`);

        return startDate < endDate;
      }),
      otherwise: yup.string(),
    });

  const notificationSchema = yup.object().shape({
    atTime: yup
      .string()
      .nullable()
      .when('triggerType', (triggerType: NotificationType, schema) => {
        if (triggerType === NotificationType.Fixed) {
          return schema.required(getIsRequiredValidateMessage('atTime'));
        }

        return schema;
      }),
    fromTime: yup
      .string()
      .nullable()
      .when('triggerType', (triggerType: NotificationType, schema) => {
        if (triggerType === NotificationType.Random) {
          return schema.required(getIsRequiredValidateMessage('fromTime'));
        }

        return schema;
      }),
    toTime: yup
      .string()
      .nullable()
      .when('triggerType', (triggerType: NotificationType, schema) => {
        if (triggerType === NotificationType.Random) {
          return schema.required(getIsRequiredValidateMessage('toTime'));
        }

        return schema;
      }),
  });

  return yup
    .object({
      activityOrFlowId: yup.string().required(activityRequired),
      timerDuration: yup.string().when('timerType', {
        is: TimerType.Timer,
        then: yup.string().test('is-valid-duration', timerDurationCheck, (value) => {
          if (!value) {
            return false;
          }
          const [hours, minutes] = value.split(':');

          return Number(hours) > 0 || Number(minutes) > 0;
        }),
        otherwise: yup.string(),
      }),
      startTime: getTimeComparison(),
      endTime: getTimeComparison(),
      notifications: yup.array().of(notificationSchema),
    })
    .required();
};
