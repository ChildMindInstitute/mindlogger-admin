import { useTranslation } from 'react-i18next';
import { Box, Button } from '@mui/material';

import { Svg } from 'shared/components';

import { ItemOptionContainer } from '../ItemOptionContainer';

export const VideoResponse = () => {
  const { t } = useTranslation('app');

  return (
    <ItemOptionContainer
      title={t('videoResponseTitle')}
      description={t('videoResponseDescription')}
    >
      <Box>
        <Button variant="contained" startIcon={<Svg id="video" width="18" height="18" />} disabled>
          {t('video')}
        </Button>
      </Box>
    </ItemOptionContainer>
  );
};
