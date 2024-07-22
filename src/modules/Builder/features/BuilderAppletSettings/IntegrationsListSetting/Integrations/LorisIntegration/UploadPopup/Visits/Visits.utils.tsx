import { ChangeEvent } from 'react';
import { FieldErrors } from 'react-hook-form';
import get from 'lodash.get';
import { Checkbox } from '@mui/material';
import { format } from 'date-fns';

import i18n from 'i18n';
import { HeadCell } from 'shared/types/table';
import { LorisActivityForm, LorisUsersVisit } from 'modules/Builder/api';
import { DateFormats } from 'shared/consts';
import { CheckboxController } from 'shared/components/FormComponents';

import { StyledSelectController } from './Visits.styles';
import { GetActivitiesRows, GetMatchOptionsProps, VisitRow } from './Visits.types';

const { t } = i18n;

export const getHeadCells = (
  selectAllChecked: boolean,
  onSelectAllClick: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void,
): HeadCell[] => [
  {
    id: 'selected',
    label: <Checkbox checked={selectAllChecked} onChange={onSelectAllClick} />,
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
}: GetActivitiesRows) =>
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
                name={`visitsForm.${userIndex}.activities.${activityIndex}.selected`}
                label={<></>}
                onCustomChange={() =>
                  trigger(`visitsForm.${userIndex}.activities.${activityIndex}.visit`)
                }
                data-testid={`loris-visits-checkbox-${userIndex}-${activityIndex}`}
              />
            ),
            value: '',
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
                control={control}
                name={`visitsForm.${userIndex}.activities.${activityIndex}.visit`}
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

export const findVisitErrorMessage = (
  errors: FieldErrors<{ visitsForm: LorisUsersVisit<LorisActivityForm>[] }>,
): string | null => {
  if (errors?.visitsForm?.length) {
    for (let user = 0; user < errors.visitsForm.length; user++) {
      const activities = errors.visitsForm[user]?.activities;
      if (activities?.length) {
        for (let activity = 0; activity < activities.length; activity++) {
          const visitError = get(errors, `visitsForm.${user}.activities.${activity}.visit.message`);
          if (visitError) {
            return visitError;
          }
        }
      }
    }
  }

  return null;
};
