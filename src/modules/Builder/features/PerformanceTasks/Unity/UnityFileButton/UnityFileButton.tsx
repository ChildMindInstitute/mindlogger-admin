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

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(2),
      }}
    >
      {isValidFile && <UnityFilePreview fileContent={fileContent} />}
      <Button
        startIcon={<Svg id={isValidFile ? 'edit' : 'add'} />}
        variant="contained"
        color="primary"
        onClick={onOpenModal}
        sx={{ alignSelf: 'flex-start' }}
        data-testid="builder-activity-unity-file-modal-button"
      >
        {t(isValidFile ? 'unityUpdateFile' : 'uploadFile')}
      </Button>
    </Box>
  );
};
