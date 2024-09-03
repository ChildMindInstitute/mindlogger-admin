import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal } from 'shared/components';
import { StyledModalWrapper } from 'shared/styles';

interface UnityFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: () => void;
  dataTestid: string;
}

const UnityFileModal: React.FC<UnityFileModalProps> = ({
  isOpen,
  onClose,
  dataTestid,
  onUpload,
}) => {
  const { t } = useTranslation('app');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = () => {
    // Handle file upload logic here
    if (selectedFile) {
      // Upload the file to the server
      onUpload();
    }
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      onSecondBtnSubmit={onClose}
      title={t('deleteActivity')}
      buttonText={t('delete')}
      secondBtnText={t('cancel')}
      hasSecondBtn
      submitBtnColor="error"
      data-testid={dataTestid}
    >
      <StyledModalWrapper>
        <input type="file" onChange={handleFileChange} />
      </StyledModalWrapper>
    </Modal>
  );
};

export default UnityFileModal;
