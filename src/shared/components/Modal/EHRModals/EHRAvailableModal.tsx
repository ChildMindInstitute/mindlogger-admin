import { Box } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';

import { variables } from 'shared/styles';

import { Modal } from '../Modal';
import { EHRAvailableModalProps } from './EHRAvailableModal.types';
import { EHR_GO_TO_WEBSITE_URL } from './EHRModals.const';

export const EHRAvailableModal = ({ open, onClose }: EHRAvailableModalProps) => {
  const { t } = useTranslation();

  const handleGoToWebsite = () => {
    window.open(EHR_GO_TO_WEBSITE_URL, '_blank');
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      hasCloseIcon={false}
      title={t('requestHealthRecordDataSettings.modal.title')}
      buttonText={t('requestHealthRecordDataSettings.modal.cta')}
      onSubmit={handleGoToWebsite}
      hasSecondBtn
      secondBtnText={t('close')}
      onSecondBtnSubmit={onClose}
      width="61"
      data-testid="ehr-available-modal"
      sxProps={{
        '.MuiPaper-root': {
          backgroundColor: variables.palette.surface3,
        },
      }}
    >
      <Box sx={{ px: 3.2 }}>
        <Trans i18nKey="requestHealthRecordDataSettings.modal.content">
          <p style={{ marginTop: 20 }}>
            Now it is possible to import participants' Electronic Health Care Data, and use that
            data with what you collect in your Mindlogger Activities.
          </p>
          <p style={{ marginTop: 24, marginBottom: 18 }}>
            Please check out the website for more information.
          </p>
        </Trans>
      </Box>
    </Modal>
  );
};
