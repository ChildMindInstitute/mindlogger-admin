import { ChangeEvent } from 'react';
import { FieldErrors } from 'react-hook-form';
import get from 'lodash.get';
import { Checkbox } from '@mui/material';
import { format } from 'date-fns';

import i18n from 'i18n';
import { HeadCell } from 'shared/types/table';
import { DateFormats } from 'shared/consts';
import { CheckboxController } from 'shared/components/FormComponents';

import { StyledSelectController } from './Visits.styles';
import { GetActivitiesRows, GetMatchOptionsProps } from './Visits.types';
import { UploadDataForm } from '../UploadPopup.types';

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
    id: 'completedDate',
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

export const getActivitiesRows = ({
  control,
  trigger,
  visitsList,
  visitsForm,
  handleChangeVisit,
}: GetActivitiesRows) =>
  visitsForm.map(
    ({ activityName, completedDate, secretUserId, visits }, index) => ({
      selected: {
        content: () => (
          <CheckboxController
            control={control}
            name={`visitsForm.${index}.selected`}
            label={<></>}
            onCustomChange={() => {
              trigger(`visitsForm.${index}.visit`);
            }}
            data-testid="loris-visits-checkbox"
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
        content: () => <>{format(new Date(completedDate), DateFormats.YearMonthDayHoursMinutes)}</>,
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
            name={`visitsForm.${index}.visit`}
            options={getMatchOptions({ visitsList, visits })}
            placeholder={t('select')}
            isLabelNeedTranslation={false}
            data-testid="loris-visits-select"
            customChange={({ target: { value } }) =>
              handleChangeVisit({ activityAnswer: visitsForm[index], value })
            }
          />
        ),
        value: '',
      },
    }),
    [],
  );

export const findVisitErrorMessage = (errors: FieldErrors<UploadDataForm>): string | null => {
  if (!errors?.visitsForm?.length) return null;
  for (let i = 0; i < errors.visitsForm.length; i++) {
    const visitError = get(errors, `visitsForm[${i}].visit.message`);
    if (visitError) {
      return visitError;
    }
  }

  return null;
};
