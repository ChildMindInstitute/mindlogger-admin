import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { useState } from 'react';

import { StyledHeadlineLarge, StyledTitleMedium, theme } from 'shared/styles';

import { NameDescription } from '../NameDescription';
import { StyledPerformanceTaskBody } from '../PerformanceTasks.styles';
import UnityFileModal from './UnityFileModal/UnityFileModal';

export const Unity = () => {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const dataTestid = 'builder-activity-unity';

  const handleUpload = () => {
    console.log('ABVC');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Box sx={{ overflowY: 'auto' }}>
      <StyledPerformanceTaskBody sx={{ p: theme.spacing(2.4, 6.4) }}>
        <StyledHeadlineLarge sx={{ mb: theme.spacing(3) }}>{'Unity file '}</StyledHeadlineLarge>
        <NameDescription />
        <StyledTitleMedium sx={{ mb: theme.spacing(2.4) }}>{t('instructions')}</StyledTitleMedium>
        <UnityFileModal
          dataTestid={dataTestid}
          onUpload={handleUpload}
          onClose={() => handleCloseModal()}
          isOpen={isModalOpen}
        />
      </StyledPerformanceTaskBody>
    </Box>
  );
};
