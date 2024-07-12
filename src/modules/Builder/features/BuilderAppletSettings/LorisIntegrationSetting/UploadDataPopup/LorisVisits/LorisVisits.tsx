import { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormContext, useWatch } from 'react-hook-form';
import { Box } from '@mui/material';

import { LorisActivityForm, LorisUsersVisit } from 'modules/Builder/api';
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
  const visitsForm: LorisUsersVisit<LorisActivityForm>[] = useWatch({ name: 'visitsForm' });

  const { isLoadingCompleted } = useFetchVisitsData({
    appletId,
    onSetIsLoading,
    setVisitsData,
    setVisitsList,
    reset,
    setStep,
  });

  const handleChangeVisit = useCallback(
    ({ userIndex, activityIndex, value }: HandleChangeVisitProps) => {
      const formData = [...visitsForm];
      const currentActivity = formData[userIndex].activities[activityIndex];

      formData[userIndex].activities = formData[userIndex].activities.map((activity, index) => {
        // skip other activities
        if (activity.activityId !== currentActivity.activityId) return activity;

        // update the current activity
        if (activityIndex === index) {
          return {
            ...activity,
            visit: value,
          };
        }

        // update the same activities
        const updatedVisits = [
          ...(activity.visits || []).filter((visit) => visit !== currentActivity.visit), // remove the old value
          value,
        ];

        return {
          ...activity,
          visits: updatedVisits,
        };
      });

      setValue('visitsForm', formData);
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
