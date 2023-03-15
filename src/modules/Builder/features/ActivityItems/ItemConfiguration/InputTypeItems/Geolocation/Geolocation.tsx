import { Button, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';

import { ItemOptionContainer } from '../ItemOptionContainer';

export const Geolocation = () => {
  const { t } = useTranslation('app');

  return (
    <ItemOptionContainer title={t('geolocation')} description={t('geolocationDescription')}>
      <Box>
        <Button
          variant="contained"
          startIcon={<Svg id="geolocation" width="18" height="18" />}
          disabled
        >
          {t('geolocation')}
        </Button>
      </Box>
    </ItemOptionContainer>
  );
};
