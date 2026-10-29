import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal } from 'shared/components';
import { StyledModalWrapper } from 'shared/styles';

interface UnityFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
  dataTestid: string;
}

const UnityFileModal: React.FC<UnityFileModalProps> = memo(
  ({ isOpen, onClose, dataTestid, onUpload }) => {
    const { t } = useTranslation('app');

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setSelectedFile(file);
      }
    };

    const handleClose = () => {
      setSelectedFile(null);
      onClose();
    };

    const handleSubmit = () => {
      if (selectedFile) {
        onUpload(selectedFile);
      }
      handleClose();
    };

    return (
      <Modal
        open={isOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        onSecondBtnSubmit={handleClose}
        disabledSubmit={!selectedFile}
        title={t('uploadUnityConfigFile')}
        buttonText={t('upload')}
        secondBtnText={t('cancel')}
        hasSecondBtn={false}
        submitBtnColor="primary"
        footerStyles={{ justifyContent: 'flex-end' }}
        data-testid={dataTestid}
      >
        <StyledModalWrapper>
          <input type="file" onChange={handleFileChange} />
        </StyledModalWrapper>
      </Modal>
    );
  },
);

export default UnityFileModal;
