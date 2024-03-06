import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { StyledTitleMedium, theme } from 'shared/styles';
import { Modal } from 'shared/components';

import { RemoveAudioPopupProps } from './RemoveAudioPopup.types';
import { removeAudioPopupDataTestid } from './RemoveAudioPopup.const';

export const RemoveAudioPopup = ({ open, onClose, onRemove }: RemoveAudioPopupProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      open={open}
      hasSecondBtn
      title={t('deleteAudio')}
      buttonText={t('delete')}
      secondBtnText={t('cancel')}
      submitBtnColor="error"
      onClose={onClose}
      onSubmit={onRemove}
      onSecondBtnSubmit={onClose}
      data-testid={removeAudioPopupDataTestid}
    >
      <Box sx={{ ml: theme.spacing(3.2) }}>
        <StyledTitleMedium data-testid={`${removeAudioPopupDataTestid}-description`}>
          {t('removeAudioDescription')}
        </StyledTitleMedium>
      </Box>
    </Modal>
  );
};
