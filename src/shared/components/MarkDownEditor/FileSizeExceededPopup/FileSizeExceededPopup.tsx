import { useTranslation } from 'react-i18next';

import { Modal } from 'shared/components/Modal';
import { StyledBodyLarge, StyledModalWrapper, variables } from 'shared/styles';
import { byteFormatter } from 'shared/utils';

import { FileSizeExceededPopupProps } from './FileSizeExceededPopup.types';

export const FileSizeExceededPopup = ({
  popupVisible,
  size,
  onClose,
  'data-testid': dataTestid,
}: FileSizeExceededPopupProps) => {
  const { t } = useTranslation('app');

  return (
    <Modal
      open={popupVisible}
      onClose={onClose}
      onSubmit={onClose}
      onSecondBtnSubmit={onClose}
      title={t('uploadFile')}
      buttonText={t('ok')}
      secondBtnText={t('cancel')}
      hasSecondBtn
      data-testid={dataTestid}
    >
      <StyledModalWrapper>
        <StyledBodyLarge sx={{ color: variables.palette.semantic.error }}>
          {t('fileSizeExceed', { size: byteFormatter(size) })}
        </StyledBodyLarge>
      </StyledModalWrapper>
    </Modal>
  );
};
