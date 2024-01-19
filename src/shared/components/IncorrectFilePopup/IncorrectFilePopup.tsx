import { Trans, useTranslation } from 'react-i18next';

import { Modal } from 'shared/components/Modal';
import { StyledBodyLarge, StyledModalWrapper, variables } from 'shared/styles';
import { MAX_FILE_SIZE_25MB, UploadFileError } from 'shared/consts';
import { byteFormatter } from 'shared/utils/fileSystem';

import { IncorrectFilePopupProps } from './IncorrectFilePopup.types';
import { formatError } from './IncorrectFilePopup.const';

export const IncorrectFilePopup = ({
  popupVisible,
  onClose,
  uiType,
  fileType,
  'data-testid': dataTestid,
}: IncorrectFilePopupProps) => {
  const { t } = useTranslation('app');

  const isFormatError = uiType === UploadFileError.Format;

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
      <StyledModalWrapper data-testid={`${dataTestid}-text`}>
        <StyledBodyLarge sx={{ color: variables.palette.semantic.error }}>
          {isFormatError ? (
            t(formatError[fileType])
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
