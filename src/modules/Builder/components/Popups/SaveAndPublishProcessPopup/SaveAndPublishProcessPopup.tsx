import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { Modal } from 'shared/components';
import { StyledModalWrapper, theme } from 'shared/styles';

import {
  SaveAndPublishProcessPopupProps,
  SavaAndPublishStep,
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
  if (step === SavaAndPublishStep.BeingCreated) {
    modalProps = {
      hasActions: false,
    };
  }
  if (step === SavaAndPublishStep.Failed) {
    modalProps = {
      buttonText: t('retry'),
      onSubmit: onRetry,
      hasSecondBtn: true,
      secondBtnText: t('back'),
      onSecondBtnSubmit: onClose,
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
            pb: step === SavaAndPublishStep.BeingCreated ? theme.spacing(3.2) : 0,
          }}
        >
          <Description step={step} />
        </Box>
      </StyledModalWrapper>
    </Modal>
  );
};
