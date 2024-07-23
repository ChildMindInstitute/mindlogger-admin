import { format } from 'date-fns';

import i18n from 'i18n';
import { HeadCell } from 'shared/types/table';
import { LorisUserAnswerVisit, LorisUsersVisits } from 'modules/Builder/api';
import { DateFormats } from 'shared/consts';
import { CheckboxController } from 'shared/components/FormComponents';

import { StyledSelectController } from './LorisVisits.styles';
import { GetLorisActivitiesRows, GetMatchOptionsProps } from './LorisVisits.types';

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
            data-testid={`loris-visits-checkbox-${index}`}
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
            data-testid={`loris-visits-select-${index}`}
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

export const formatData = ({
  activityHistoryVisits,
  answers,
}: LorisUsersVisits): LorisUserAnswerVisit[] =>
  answers.map(({ activityHistoryId, userId, ...restAnswerData }) => {
    const activityHistory = activityHistoryVisits[activityHistoryId];

    if (!activityHistory) {
      return {
        ...restAnswerData,
        activityHistoryId,
        userId,
        visits: [],
        visit: '',
        selected: true,
      };
    }

    const userVisits = activityHistory.find((history) => history?.userId === userId);

    return {
      ...restAnswerData,
      activityHistoryId,
      userId,
      visits: userVisits?.visits ?? [],
      visit: '',
      selected: true,
    };
  });
