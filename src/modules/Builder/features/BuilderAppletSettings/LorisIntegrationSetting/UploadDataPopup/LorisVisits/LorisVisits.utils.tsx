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

export const formatData = ({ activityVisits, answers }: LorisUsersVisits): LorisUserAnswerVisit[] =>
  answers.map(({ activityId, userId, ...restAnswerData }) => {
    const activityUsersVisits = activityVisits[activityId];

    if (!activityUsersVisits) {
      return {
        ...restAnswerData,
        activityId,
        userId,
        visits: [],
        visit: '',
        selected: true,
      };
    }

    const userVisits = activityUsersVisits.find(
      (activityUserVisits) => activityUserVisits?.userId === userId,
    );

    return {
      ...restAnswerData,
      activityId,
      userId,
      visits: userVisits?.visits ?? [],
      visit: '',
      selected: true,
    };
  });
