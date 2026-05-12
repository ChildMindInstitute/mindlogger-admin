import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button } from '@mui/material';

import { theme } from 'shared/styles';
import { Svg } from 'shared/components';

import { UnityFilePreview } from '../UnityFilePreview';

interface UnityFileButtonProps {
  isValidFile: boolean;
  fileContent: string;
  onOpenModal: () => void;
}

// TODO Upload a new file if already uploaded should be implemented - TASK https://mindlogger.atlassian.net/browse/M2-7779
export const UnityFileButton: React.FC<UnityFileButtonProps> = ({
  isValidFile,
  fileContent,
  onOpenModal,
}) => {
  const { t } = useTranslation();

  return isValidFile ? (
    <UnityFilePreview fileContent={fileContent} />
  ) : (
    <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
      <Button
        variant="text"
        startIcon={<Svg id="add" width={18} height={18} />}
        onClick={onOpenModal}
        sx={{ ml: theme.spacing(-1) }}
        data-testid="builder-activities-add-activity"
      >
        {t('upload')}
      </Button>
    </Box>
  );
};
