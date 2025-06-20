import { Box } from '@mui/material';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { LorisUserAnswerVisit } from 'modules/Builder/api';
import { UiType } from 'shared/components/Table';
import { StyledBodyMedium, StyledTitleMedium, theme, variables } from 'shared/styles';

import { StyledTable } from './Visits.styles';
import { HandleChangeVisitProps, VisitsProps } from './Visits.types';
import { findVisitErrorMessage, getActivitiesRows, getHeadCells } from './Visits.utils';

export const Visits = ({ visitsList }: VisitsProps) => {
  const { t } = useTranslation();
  const [selectAllChecked, setSelectAllChecked] = useState(true);
  const {
    control,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext();

  const visitsForm: LorisUserAnswerVisit[] = useWatch({ name: 'visitsForm' });

  const handleChangeVisit = useCallback(
    ({ activityAnswer, value }: HandleChangeVisitProps) => {
      const updatedVisitsForm = visitsForm.map((userActivityAnswer) => {
        const { userId, activityId, answerId, visits } = userActivityAnswer;
        if (activityAnswer.activityId === activityId && activityAnswer.userId === userId) {
          if (activityAnswer.answerId === answerId) {
            return {
              ...userActivityAnswer,
              visit: value,
            };
          }

          return {
            ...userActivityAnswer,
            visits: [...(visits || []).filter((visit) => visit !== activityAnswer.visit), value],
          };
        }

        return userActivityAnswer;
      });

      setValue('visitsForm', updatedVisitsForm);
    },
    [setValue, visitsForm],
  );

  const onSelectAllClick = (_: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setSelectAllChecked(checked);
    const formData = visitsForm.map((visit) => ({
      ...visit,
      selected: checked,
    }));

    setValue('visitsForm', formData);
    trigger('visitsForm');
  };

  const tableRows = useMemo(
    () =>
      getActivitiesRows({
        control,
        trigger,
        visitsList,
        visitsForm,
        handleChangeVisit,
      }),
    [control, trigger, handleChangeVisit, visitsForm, visitsList],
  );

  const error = findVisitErrorMessage(errors);

  return (
    <>
      {
        <Box sx={{ minHeight: visitsForm.length ? '14rem' : 'auto' }} data-testid="loris-visits">
          <>
            <StyledTitleMedium sx={{ mb: theme.spacing(2.4), color: variables.palette.on_surface }}>
              {t('loris.visitsDescription')}
            </StyledTitleMedium>
            <StyledTable
              maxHeight="38rem"
              columns={getHeadCells(selectAllChecked, onSelectAllClick)}
              rows={tableRows}
              order="desc"
              orderBy={'completedDate'}
              uiType={UiType.Secondary}
              tableHeadBg={variables.modalBackground}
            />
            {error && (
              <StyledBodyMedium
                sx={{ color: variables.palette.error, mt: theme.spacing(0.8) }}
                data-testid="upload-data-popup-error"
              >
                {error}
              </StyledBodyMedium>
            )}
          </>
        </Box>
      }
    </>
  );
};
