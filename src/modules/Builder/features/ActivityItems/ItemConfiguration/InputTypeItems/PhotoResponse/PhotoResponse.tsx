import { useTranslation } from 'react-i18next';
import { Button, Box } from '@mui/material';

import { Svg } from 'shared/components';

import { ItemOptionContainer } from '../ItemOptionContainer';

export const PhotoResponse = () => {
  const { t } = useTranslation('app');

  return (
    <ItemOptionContainer
      title={t('photoResponseTitle')}
      description={t('photoResponseDescription')}
    >
      <Box>
        <Button variant="contained" startIcon={<Svg id="photo" width="18" height="18" />} disabled>
          {t('photo')}
        </Button>
      </Box>
    </ItemOptionContainer>
  );
};
