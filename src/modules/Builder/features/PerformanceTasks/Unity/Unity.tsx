import { useTranslation } from 'react-i18next';
import { Box, Button } from '@mui/material';
import { useState } from 'react';

import { StyledHeadlineLarge, StyledTitleLarge, theme } from 'shared/styles';
import { ToggleContainerUiType, ToggleItemContainer } from 'modules/Builder/components';
import { Svg } from 'shared/components';

import { StyledPerformanceTaskBody } from '../PerformanceTasks.styles';
import UnityFileModal from './UnityFileModal/UnityFileModal';
import { UnityFilePreview } from './UnityFilePreview';

export const Unity = () => {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const isValidFile = file !== null && file.type === 'application/x-yaml';

  const dataTestid = 'builder-activity-unity';

  const handleUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const OpenModalButton = () =>
    isValidFile ? (
      <UnityFilePreview file={file} />
    ) : (
      <Button
        variant="text"
        startIcon={<Svg id="add" width={18} height={18} />}
        onClick={handleOpenModal}
        sx={{ mr: theme.spacing(1.6) }}
        data-testid="builder-activities-add-activity"
      >
        {t('upload')}
      </Button>
    );

  return (
    <Box sx={{ overflowY: 'auto' }}>
      <StyledPerformanceTaskBody sx={{ p: theme.spacing(2.4, 6.4) }}>
        <StyledHeadlineLarge sx={{ mb: theme.spacing(3) }}>
          {t('performanceTasks.unity')}
        </StyledHeadlineLarge>
        <StyledTitleLarge sx={{ mb: theme.spacing(2.4) }}>
          {t('unityInstructions')}
        </StyledTitleLarge>

        <ToggleItemContainer
          uiType={ToggleContainerUiType.PerformanceTask}
          title={t('unityTaskConfigurationFile')}
          Content={OpenModalButton}
          data-testid="builder-activity-unity-file-uploader"
        />
      </StyledPerformanceTaskBody>
      <UnityFileModal
        dataTestid={dataTestid}
        onUpload={handleUpload}
        onClose={() => handleCloseModal()}
        isOpen={isModalOpen}
      />
    </Box>
  );
};
