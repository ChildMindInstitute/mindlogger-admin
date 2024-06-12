import { Control, FieldValues } from 'react-hook-form';
import { format } from 'date-fns';

import i18n from 'i18n';
import { HeadCell } from 'shared/types/table';
import { LorisUsersVisits } from 'modules/Builder/api';
import { DateFormats } from 'shared/consts';

import { StyledSelectController } from './LorisVisits.styles';
import { VisitRow } from './LorisVisits.types';

const { t } = i18n;

export const getHeadCells = (): HeadCell[] => [
  {
    id: 'activityName',
    label: t('activityName'),
    enableSort: false,
  },
  {
    id: 'completed',
    label: t('loris.completed'),
    enableSort: false,
  },
  {
    id: 'secretUserId',
    label: t('secretUserId'),
    enableSort: false,
  },
  {
    id: 'lorisVisits',
    label: t('loris.visits'),
    enableSort: false,
  },
];

export const getMatchOptions = (visits: string[]) =>
  visits.map((visit) => ({ labelKey: visit, value: visit }));

export const getLorisActivitiesRows = (
  control: Control<FieldValues>,
  visitsList: string[],
  usersVisits: LorisUsersVisits,
) =>
  Object.keys(usersVisits).reduce((rows: VisitRow, userId) => {
    const activities = usersVisits[userId] || [];
    const userActivities = activities.map(
      ({ activityName, completedDate, secretUserId, visit }, index) => ({
        activityName: {
          content: () => <>{activityName}</>,
          value: activityName,
        },
        completedDate: {
          content: () => (
            <>{format(new Date(completedDate), DateFormats.YearMonthDayHoursMinutes)}</>
          ),
          value: completedDate,
        },
        secretUserId: {
          content: () => <>{secretUserId}</>,
          value: secretUserId,
        },
        lorisVisits: {
          content: () => (
            <StyledSelectController
              control={control}
              name={`${userId}[${index}].visit`}
              options={getMatchOptions(visitsList)}
              placeholder={t('select')}
              isLabelNeedTranslation={false}
              data-testid={`loris-visits-select-${index}`}
            />
          ),
          value: visit || '',
        },
      }),
    );

    return rows.concat(userActivities);
  }, []);

export const formatData = (activities: LorisUsersVisits) =>
  Object.keys(activities).reduce((rows, userId) => {
    const userActivities = activities[userId] || [];
    const formattedActivities = userActivities.map((activity) => ({
      ...activity,
      visit: activity.visit || '',
    }));

    return {
      ...rows,
      [userId]: formattedActivities,
    };
  }, {});
