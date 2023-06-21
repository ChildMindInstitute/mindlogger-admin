import { Trans, useTranslation } from 'react-i18next';

import { Modal } from 'shared/components/Modal';
import { StyledBodyLarge, StyledModalWrapper, variables } from 'shared/styles';
import { byteFormatter } from 'shared/utils';
import { MAX_FILE_SIZE_25MB, UploadImageError } from 'shared/consts';

import { IncorrectImagePopupProps } from './IncorrectImagePopup.types';

export const IncorrectImagePopup = ({
  popupVisible,
  onClose,
  uiType,
}: IncorrectImagePopupProps) => {
  const { t } = useTranslation('app');

  const isFormatError = uiType === UploadImageError.Format;

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
    >
      <StyledModalWrapper>
        <StyledBodyLarge sx={{ color: variables.palette.semantic.error }}>
          {isFormatError ? (
            t('incorrectImageFormat')
          ) : (
            <Trans i18nKey="incorrectImageSize">
              Image is more than <>{{ size: byteFormatter(MAX_FILE_SIZE_25MB) }}</>.
            </Trans>
          )}
        </StyledBodyLarge>
      </StyledModalWrapper>
    </Modal>
  );
};
