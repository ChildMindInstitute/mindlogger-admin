import { format } from 'date-fns';

import i18n from 'i18n';
import { DateFormats } from 'shared/consts';
import { Svg } from 'shared/components';
import { Activity, ActivityFlow } from 'shared/state';
import { CreateEventType, TimerType } from 'modules/Dashboard/api';

const { t } = i18n;

export const convertDateToYearMonthDay = (date: Date | string) =>
  typeof date === 'string' ? date : format(date, DateFormats.YearMonthDay);

export const addSecondsToHourMinutes = (timeStr: string) => `${timeStr}:00`;

export const getTimer = (
  timerType: TimerType,
  body: CreateEventType['body'],
  timerDuration: string,
  idleTime: string,
) => {
  switch (timerType) {
    case TimerType.Timer:
      return (body.timer = addSecondsToHourMinutes(timerDuration));
    case TimerType.Idle:
      return (body.timer = addSecondsToHourMinutes(idleTime));
  }
};

export const getActivitiesFlows = (activities: Activity[], activityFlows: ActivityFlow[]) => [
  ...activities.map(({ id, name, isHidden }) => ({
    value: id,
    labelKey: name,
    ...(isHidden && {
      disabled: true,
      tooltip: t('activityDeactivated'),
    }),
  })),
  ...activityFlows.map(({ id, name, isHidden }) => ({
    value: `flow-${id}`,
    labelKey: name,
    icon: <Svg id="flow" width="15" height="15" />,
    ...(isHidden && {
      disabled: true,
      tooltip: t('flowDeactivated'),
    }),
  })),
];
