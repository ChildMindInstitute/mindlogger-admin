import { format } from 'date-fns';

import i18n from 'i18n';
import { HeadCell } from 'shared/types/table';
import { LorisUsersVisit } from 'modules/Builder/api';
import { DateFormats } from 'shared/consts';

import { StyledSelectController } from './LorisVisits.styles';
import { GetLorisActivitiesRows, VisitRow } from './LorisVisits.types';

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

export const getMatchOptions = (visits: string[], itemsDisabled: string[]) =>
  visits.map((visit) => ({
    labelKey: visit,
    value: visit,
    disabled: itemsDisabled.includes(visit),
  }));

export const getLorisActivitiesRows = ({
  control,
  visitsList,
  usersVisits,
}: GetLorisActivitiesRows) =>
  usersVisits.reduce(
    (data: VisitRow[], { activities, secretUserId }: LorisUsersVisit, userIndex) => {
      const userActivities = (activities || []).map(
        ({ activityName, completedDate, visits }, activityIndex) => ({
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
                className="visits-select"
                control={control}
                name={`visitsForm[${userIndex}].activities[${activityIndex}].visit`}
                options={getMatchOptions(visitsList, visits)}
                placeholder={t('select')}
                isLabelNeedTranslation={false}
                data-testid={`loris-visits-select-${userIndex}-${activityIndex}`}
              />
            ),
            value: '',
          },
        }),
      );

      return data.concat(userActivities);
    },
    [],
  );

export const formatData = (usersVisits: LorisUsersVisit[]) =>
  usersVisits.map(({ activities, ...userData }) => {
    // eslint-disable-next-line unused-imports/no-unused-vars
    const formattedActivities = activities.map(({ visits, ...activity }) => ({
      ...activity,
      visit: '',
    }));

    return {
      ...userData,
      activities: formattedActivities,
    };
  });
