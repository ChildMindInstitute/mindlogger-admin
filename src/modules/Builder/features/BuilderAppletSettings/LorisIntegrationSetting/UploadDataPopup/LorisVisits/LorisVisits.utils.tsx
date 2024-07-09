import { format } from 'date-fns';

import i18n from 'i18n';
import { HeadCell } from 'shared/types/table';
import { LorisActivityForm, LorisActivityResponse, LorisUsersVisit } from 'modules/Builder/api';
import { DateFormats } from 'shared/consts';
import { CheckboxController } from 'shared/components/FormComponents';

import { StyledSelectController } from './LorisVisits.styles';
import { GetLorisActivitiesRows, GetMatchOptionsProps, VisitRow } from './LorisVisits.types';

const { t } = i18n;

export const getHeadCells = (): HeadCell[] => [
  {
    id: 'selected',
    label: '',
    enableSort: false,
  },
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

export const getMatchOptions = ({ visitsList = [], visits = [] }: GetMatchOptionsProps) =>
  visitsList.map((visit) => ({
    labelKey: visit,
    value: visit,
    disabled: visits.includes(visit),
  }));

export const getLorisActivitiesRows = ({
  control,
  trigger,
  visitsList,
  visitsForm,
  handleChangeVisit,
}: GetLorisActivitiesRows) =>
  visitsForm.reduce(
    (
      data: VisitRow[],
      { activities, secretUserId }: LorisUsersVisit<LorisActivityForm>,
      userIndex,
    ) => {
      const userActivities = (activities || []).map(
        ({ activityName, completedDate, visits }, activityIndex) => ({
          selected: {
            content: () => (
              <CheckboxController
                control={control}
                name={`visitsForm[${userIndex}].activities[${activityIndex}].selected`}
                label={<></>}
                onCustomChange={() => {
                  trigger(`visitsForm[${userIndex}].activities[${activityIndex}].visit`);
                }}
                data-testid={`loris-visits-checkbox-${userIndex}-${activityIndex}`}
              />
            ),
            value: activityName,
            maxWidth: '3.2rem',
          },
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
                options={getMatchOptions({ visitsList, visits })}
                placeholder={t('select')}
                isLabelNeedTranslation={false}
                data-testid={`loris-visits-select-${userIndex}-${activityIndex}`}
                customChange={({ target: { value } }) =>
                  handleChangeVisit({ userIndex, activityIndex, value })
                }
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

export const formatData = (
  usersVisits: LorisUsersVisit<LorisActivityResponse>[],
): LorisUsersVisit<LorisActivityResponse>[] =>
  usersVisits.reduce((acc: LorisUsersVisit[], { activities, ...userData }) => {
    // TODO: move this logic to the backend
    const allVisits = activities.reduce(
      (visitsAcc, { activityId, visits }) => {
        if (visits.length) {
          visitsAcc[activityId] = visitsAcc[activityId]
            ? visitsAcc[activityId].concat(visits)
            : visits;
        }

        return visitsAcc;
      },
      {} as Record<string, string[]>,
    );

    const filteredActivities = activities
      .filter(({ visits }) => !visits.length)
      .map((activity) => ({
        ...activity,
        visits: allVisits[activity.activityId] || [],
        visit: '',
        selected: true,
      }));

    if (!filteredActivities.length) {
      return acc;
    }

    acc.push({ ...userData, activities: filteredActivities });

    return acc;
  }, []);
