import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { StyledTitleMedium, theme } from 'shared/styles';
import { Modal } from 'shared/components';

import { RemoveAudioPopupProps } from './RemoveAudioPopup.types';

export const RemoveAudioPopup = ({ open, onClose, onRemove }: RemoveAudioPopupProps) => {
  const { t } = useTranslation();

  const dataTestid = 'builder-activity-items-item-configuration-audio-player-remove-popup';

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
      data-testid={dataTestid}
    >
      <Box sx={{ ml: theme.spacing(3.2) }}>
        <StyledTitleMedium data-testid={`${dataTestid}-description`}>
          {t('removeAudioDescription')}
        </StyledTitleMedium>
      </Box>
    </Modal>
  );
};
