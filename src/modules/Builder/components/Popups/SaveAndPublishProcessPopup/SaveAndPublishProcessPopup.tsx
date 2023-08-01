import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { Modal } from 'shared/components';
import { StyledLinearProgress, StyledModalWrapper, theme, variables } from 'shared/styles';

import {
  SaveAndPublishProcessPopupProps,
  SaveAndPublishSteps,
} from './SaveAndPublishProcessPopup.types';
import { Description } from './Description';

export const SaveAndPublishProcessPopup = ({
  isPopupVisible,
  step,
  onRetry,
  onClose,
}: SaveAndPublishProcessPopupProps) => {
  const { t } = useTranslation('app');

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
      onSubmit: () => console.log('save report config'),
      hasSecondBtn: true,
      secondBtnText: t('dontSave'),
      secondBtnStyles: {
        color: variables.palette.semantic.error,
        fontWeight: variables.font.weight.bold,
      },
      onSecondBtnSubmit: () => console.log('do NOT save report config'),
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
      {...modalProps}
    >
      <StyledModalWrapper>
        <Box
          sx={{
            mt: theme.spacing(-1),
            pb: step === SaveAndPublishSteps.BeingCreated ? theme.spacing(3.2) : 0,
          }}
        >
          <Description step={step} />
          {step === SaveAndPublishSteps.BeingCreated && (
            <StyledLinearProgress sx={{ mt: theme.spacing(3) }} />
          )}
        </Box>
      </StyledModalWrapper>
    </Modal>
  );
};
