import { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormContext, useWatch } from 'react-hook-form';
import { Box } from '@mui/material';

import { LorisUserAnswerVisit } from 'modules/Builder/api';
import { StyledTitleMedium, theme, variables } from 'shared/styles';
import { UiType } from 'shared/components/Table';

import { getHeadCells, getLorisActivitiesRows } from './LorisVisits.utils';
import { StyledTable } from './LorisVisits.styles';
import { HandleChangeVisitProps, LorisVisitsProps } from './LorisVisits.types';
import { useFetchVisitsData } from './LorisVisits.hooks';

export const LorisVisits = ({ onSetIsLoading, setVisitsData, setStep }: LorisVisitsProps) => {
  const { appletId } = useParams();
  const { t } = useTranslation();
  const { control, reset, setValue, trigger } = useFormContext();
  const [visitsList, setVisitsList] = useState<string[]>([]);
  const visitsForm: LorisUserAnswerVisit[] = useWatch({ name: 'visitsForm' });

  const { isLoadingCompleted } = useFetchVisitsData({
    appletId,
    onSetIsLoading,
    setVisitsData,
    setVisitsList,
    reset,
    setStep,
  });

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

  const tableRows = getLorisActivitiesRows({
    control,
    trigger,
    visitsList,
    visitsForm,
    handleChangeVisit,
  });

  return (
    <>
      {isLoadingCompleted && (
        <Box sx={{ minHeight: visitsForm.length ? '14rem' : 'auto' }} data-testid="loris-visits">
          {visitsForm.length ? (
            <>
              <StyledTitleMedium
                sx={{ mb: theme.spacing(2.4), color: variables.palette.on_surface }}
              >
                {t('loris.visitsDescription')}
              </StyledTitleMedium>
              <StyledTable
                maxHeight="34.4rem"
                columns={getHeadCells()}
                rows={tableRows}
                orderBy={'activityName'}
                uiType={UiType.Secondary}
                tableHeadBg={variables.modalBackground}
              />
            </>
          ) : (
            <StyledTitleMedium sx={{ whiteSpace: 'pre-line', color: variables.palette.on_surface }}>
              {t('loris.noDataToUpload')}
            </StyledTitleMedium>
          )}
        </Box>
      )}
    </>
  );
};
