import { Box, Button } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';

import { createIndividualEventsApi } from 'api';
import { applets } from 'modules/Dashboard/state';
import { Modal, Spinner, SpinnerUiType } from 'shared/components';
import {
  StyledBody,
  StyledBodyLarge,
  StyledFlexAllCenter,
  StyledModalWrapper,
  theme,
  variables,
} from 'shared/styles';
import { useAsync } from 'shared/hooks';
import { getErrorMessage } from 'shared/utils';
import { useAppDispatch } from 'redux/store';
import { workspaces } from 'redux/modules';
import { apiDashboardSlice } from 'modules/Dashboard/api/apiSlice';

import { ConfirmEditDefaultSchedulePopupProps } from './ConfirmEditDefaultSchedulePopup.types';

export const ConfirmEditDefaultSchedulePopup = ({
  appletId,
  canCreateIndividualSchedule,
  dataTestId,
  onClose,
  onOpenFollowUpPopup,
  respondentName,
  userId,
  ...otherProps
}: ConfirmEditDefaultSchedulePopupProps) => {
  const { t } = useTranslation('app');
  const { ownerId } = workspaces.useData() || {};
  const dispatch = useAppDispatch();

  const { execute, error, isLoading } = useAsync(createIndividualEventsApi, () => {
    if (!appletId || !userId) return;

    dispatch(applets.thunk.getEvents({ appletId, respondentId: userId }));

    if (ownerId) {
      // Refresh current user after creating schedule to update hasIndividualSchedule flag.
      // TODO: When createIndividualEventsApi has been migrated to RTK Query and configured to
      // invalidate the associated user (https://mindlogger.atlassian.net/browse/M2-8879), this can
      // be removed:
      dispatch(apiDashboardSlice.util.invalidateTags([{ type: 'User', id: userId }]));
    }

    onOpenFollowUpPopup?.();
  });

  const handleSubmit = () => {
    if (!appletId || !userId) return;
    execute({ appletId, respondentId: userId });
  };

  return (
    <Modal
      data-testid={dataTestId}
      footer={
        <>
          <Button
            data-testid={dataTestId ? `${dataTestId}-cancel-btn` : undefined}
            onClick={onClose}
          >
            {t('cancel')}
          </Button>

          <StyledFlexAllCenter sx={{ gap: 1.6 }}>
            {canCreateIndividualSchedule && (
              <Button
                data-testid={dataTestId ? `${dataTestId}-create-individual-btn` : undefined}
                onClick={handleSubmit}
                variant="tonal"
              >
                {t('confirmUpdateDefaultSchedule.createIndividualSchedule')}
              </Button>
            )}
            <Button
              data-testid={dataTestId ? `${dataTestId}-edit-default-btn` : undefined}
              onClick={onOpenFollowUpPopup}
              variant="contained"
            >
              {t('confirmUpdateDefaultSchedule.updateDefaultSchedule')}
            </Button>
          </StyledFlexAllCenter>
        </>
      }
      hasActions={false}
      onClose={onClose}
      title={t('confirmUpdateDefaultSchedule.title')}
      {...otherProps}
    >
      <StyledModalWrapper sx={{ display: 'flex', flexDirection: 'column', gap: 1.6 }}>
        <StyledBody sx={{ display: 'inline-block' }}>
          <Trans
            values={{
              respondentName: respondentName || t('confirmUpdateDefaultSchedule.thisParticipant'),
            }}
            components={[<Box component="span" sx={{ fontWeight: 700 }} />]}
            i18nKey="confirmUpdateDefaultSchedule.onDefaultSchedule"
            t={t}
          />
        </StyledBody>

        <StyledBody>
          {canCreateIndividualSchedule
            ? t('confirmUpdateDefaultSchedule.updateOrCreate')
            : t('confirmUpdateDefaultSchedule.updateDefault')}
        </StyledBody>

        {error && (
          <StyledBodyLarge color={variables.palette.semantic.error} sx={{ m: theme.spacing(1, 0) }}>
            {getErrorMessage(error)}
          </StyledBodyLarge>
        )}

        {isLoading && <Spinner uiType={SpinnerUiType.Secondary} noBackground />}
      </StyledModalWrapper>
    </Modal>
  );
};
