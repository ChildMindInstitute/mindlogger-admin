import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext, useWatch } from 'react-hook-form';
import { Box } from '@mui/material';

import { StyledBodyMedium, StyledTitleMedium, theme, variables } from 'shared/styles';
import { UiType } from 'shared/components/Table';
import { LorisActivityForm, LorisUsersVisit } from 'modules/Builder/api';

import { findVisitErrorMessage, getHeadCells, getLorisActivitiesRows } from './Visits.utils';
import { StyledTable } from './Visits.styles';
import { HandleChangeVisitProps, VisitsProps } from './Visits.types';

export const Visits = ({ visitsList }: VisitsProps) => {
  const { t } = useTranslation();
  const {
    control,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext();

  const visitsForm: LorisUsersVisit<LorisActivityForm>[] = useWatch({ name: 'visitsForm' });

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
              columns={getHeadCells()}
              rows={tableRows}
              orderBy={'activityName'}
              uiType={UiType.Secondary}
              tableHeadBg={variables.modalBackground}
            />
            {error && (
              <StyledBodyMedium
                sx={{ color: variables.palette.semantic.error, mt: theme.spacing(0.8) }}
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
