import { format } from 'date-fns';

import i18n from 'i18n';
import { DateFormats } from 'shared/consts';
import { Svg } from 'shared/components';
import { Activity, ActivityFlow } from 'modules/Dashboard/state';

const { t } = i18n;

export const convertDateToYearMonthDay = (date: Date) => format(date, DateFormats.YearMonthDay);

export const addSecondsToHourMinutes = (timeStr: string) => `${timeStr}:00`;

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
