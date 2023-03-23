import * as yup from 'yup';

import i18n from 'i18n';
import { TimerType } from 'modules/Dashboard/api';

export const ActivityFormSchema = () => {
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
    })
    .required();
};
