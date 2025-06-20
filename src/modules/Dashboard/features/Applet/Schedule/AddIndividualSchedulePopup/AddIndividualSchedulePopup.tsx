import { Trans, useTranslation } from 'react-i18next';

import { createIndividualEventsApi } from 'api';
import { applets } from 'modules/Dashboard/state';
import { workspaces } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { apiSlice } from 'shared/api/apiSlice';
import { Modal, Spinner, SpinnerUiType } from 'shared/components';
import { useAsync } from 'shared/hooks';
import { StyledBodyLarge, StyledModalWrapper, theme, variables } from 'shared/styles';
import { getErrorMessage } from 'shared/utils';

import { AddIndividualSchedulePopupProps } from './AddIndividualSchedulePopup.types';

export const AddIndividualSchedulePopup = ({
  'data-testid': dataTestid,
  appletId,
  onClose,
  open,
  userName,
  userId,
}: AddIndividualSchedulePopupProps) => {
  const { t } = useTranslation('app');
  const { ownerId } = workspaces.useData() || {};
  const dispatch = useAppDispatch();

  const {
    execute: createIndividualEvents,
    error,
    isLoading,
  } = useAsync(createIndividualEventsApi, () => {
    if (!appletId || !userId) return;

    dispatch(applets.thunk.getEvents({ appletId, respondentId: userId }));

    if (ownerId) {
      // Refresh current user after creating schedule to update hasIndividualSchedule flag.
      // TODO: When createIndividualEventsApi has been migrated to RTK Query and configured to
      // invalidate the associated user (https://mindlogger.atlassian.net/browse/M2-8879), this can
      // be removed:
      dispatch(apiSlice.util.invalidateTags([{ type: 'User', id: userId }]));
    }

    onClose?.();
  });

  const handleSubmit = () => {
    if (!appletId || !userId) return;
    createIndividualEvents({ appletId, respondentId: userId });
  };

  return (
    <Modal
      buttonText={t('confirm')}
      data-testid={dataTestid}
      disabledSubmit={isLoading}
      hasSecondBtn
      onClose={onClose}
      onSecondBtnSubmit={onClose}
      onSubmit={handleSubmit}
      open={open}
      secondBtnText={t('cancel')}
      title={t('addIndividualSchedule')}
    >
      <StyledModalWrapper>
        <StyledBodyLarge sx={{ marginTop: theme.spacing(-1) }}>
          <Trans i18nKey="addIndividualScheduleText">
            Respondent
            <strong>
              <>{{ respondentName: userName }}</>
            </strong>
            is currently using the <strong>default schedule</strong>
            Do you want to create an <strong>individual schedule</strong> for this respondent
            instead?
          </Trans>
        </StyledBodyLarge>

        {error && (
          <StyledBodyLarge color={variables.palette.error} sx={{ m: theme.spacing(1, 0) }}>
            {getErrorMessage(error)}
          </StyledBodyLarge>
        )}

        {isLoading && <Spinner uiType={SpinnerUiType.Secondary} noBackground />}
      </StyledModalWrapper>
    </Modal>
  );
};
