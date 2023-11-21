import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';

import { Modal, Spinner, SpinnerUiType } from 'shared/components';
import { theme, StyledModalWrapper, StyledBodyLarge, variables } from 'shared/styles';

import { AddIndividualSchedulePopupProps } from './AddIndividualSchedulePopup.types';

export const AddIndividualSchedulePopup = ({
  open,
  onClose,
  onSubmit,
  respondentName,
  error,
  isLoading,
  'data-testid': dataTestid,
}: AddIndividualSchedulePopupProps) => {
  const { t } = useTranslation('app');

  return (
    <Modal
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      title={t('addIndividualSchedule')}
      buttonText={t('confirm')}
      hasSecondBtn
      secondBtnText={t('cancel')}
      onSecondBtnSubmit={onClose}
      disabledSubmit={isLoading}
      data-testid={dataTestid}
    >
      <>
        {isLoading && <Spinner uiType={SpinnerUiType.Secondary} noBackground />}
        <StyledModalWrapper>
          <StyledBodyLarge sx={{ marginTop: theme.spacing(-1) }}>
            <Trans i18nKey="addIndividualScheduleText">
              Respondent
              <strong>
                <>{{ respondentName }}</>
              </strong>
              is currently using the <strong>default schedule</strong>
              Do you want to create an <strong>individual schedule</strong> for this respondent
              instead?
            </Trans>
          </StyledBodyLarge>
          {error && (
            <StyledBodyLarge
              color={variables.palette.semantic.error}
              sx={{ m: theme.spacing(1, 0) }}
            >
              {error}
            </StyledBodyLarge>
          )}
        </StyledModalWrapper>
      </>
    </Modal>
  );
};
