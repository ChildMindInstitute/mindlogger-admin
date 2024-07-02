import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';

import { createIndividualEventsApi } from 'api';
import { applets, users } from 'modules/Dashboard/state';
import { workspaces } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { Modal, Spinner, SpinnerUiType } from 'shared/components';
import { useAsync } from 'shared/hooks';
import { theme, StyledModalWrapper, StyledBodyLarge, variables } from 'shared/styles';
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
      dispatch(
        users.thunk.getAllWorkspaceRespondents({
          params: { ownerId, appletId, shell: false },
        }),
      );
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
          <StyledBodyLarge color={variables.palette.semantic.error} sx={{ m: theme.spacing(1, 0) }}>
            {getErrorMessage(error)}
          </StyledBodyLarge>
        )}

        {isLoading && <Spinner uiType={SpinnerUiType.Secondary} noBackground />}
      </StyledModalWrapper>
    </Modal>
  );
};
