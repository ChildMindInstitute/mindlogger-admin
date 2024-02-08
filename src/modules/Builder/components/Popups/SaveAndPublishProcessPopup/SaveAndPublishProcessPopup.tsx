import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { Modal } from 'shared/components';
import { StyledLinearProgress, StyledModalWrapper, theme, variables } from 'shared/styles';
import { concatIf } from 'shared/utils';
import { useAppDispatch } from 'redux/store';
import { reportConfig } from 'modules/Builder/state';

import { SaveAndPublishProcessPopupProps, SaveAndPublishSteps } from './SaveAndPublishProcessPopup.types';
import { Description } from './Description';
import { saveAndPublishProcessTestIds } from './SaveAndPublishProcessPopup.const';

export const SaveAndPublishProcessPopup = ({
  isPopupVisible,
  step,
  onRetry,
  onClose,
}: SaveAndPublishProcessPopupProps) => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();

  const { setReportConfigChanges } = reportConfig.actions;

  const handleReportConfigSave = async () => {
    await dispatch(setReportConfigChanges({ saveChanges: true }));
    onClose();
  };
  const handleReportConfigDoNotSave = async () => {
    await dispatch(setReportConfigChanges({ doNotSaveChanges: true }));
    onClose();
  };

  if (!step) return null;

  let modalProps = {};
  if (step === SaveAndPublishSteps.BeingCreated) {
    modalProps = {
      hasActions: false,
    };
  }
  if (step === SaveAndPublishSteps.Failed) {
    modalProps = {
      buttonText: t('retry'),
      onSubmit: onRetry,
      hasSecondBtn: true,
      secondBtnText: t('back'),
      onSecondBtnSubmit: onClose,
    };
  }
  if (step === SaveAndPublishSteps.ReportConfigSave) {
    modalProps = {
      title: t('reportConfiguration'),
      buttonText: t('save'),
      onSubmit: handleReportConfigSave,
      hasSecondBtn: true,
      secondBtnText: t('dontSave'),
      secondBtnStyles: {
        color: variables.palette.semantic.error,
        fontWeight: variables.font.weight.bold,
      },
      onSecondBtnSubmit: handleReportConfigDoNotSave,
      hasThirdBtn: true,
      thirdBtnText: t('cancel'),
      onThirdBtnSubmit: onClose,
    };
  }

  return (
    <Modal
      open={isPopupVisible}
      onClose={onClose}
      title={t('saveAndPublish')}
      buttonText={t('ok')}
      onSubmit={onClose}
      data-testid={concatIf('builder-save-and-publish-popup', saveAndPublishProcessTestIds[step])}
      {...modalProps}>
      <StyledModalWrapper>
        <Box
          sx={{
            mt: theme.spacing(-1),
            pb: step === SaveAndPublishSteps.BeingCreated ? theme.spacing(3.2) : 0,
          }}>
          <Description step={step} />
          {step === SaveAndPublishSteps.BeingCreated && <StyledLinearProgress sx={{ mt: theme.spacing(3) }} />}
        </Box>
      </StyledModalWrapper>
    </Modal>
  );
};
