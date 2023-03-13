import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import { StyledLabelBoldLarge, StyledTitleMedium, theme } from 'shared/styles';

import { StyledGeolocation } from './Geolocation.styles';

export const Geolocation = () => {
  const { t } = useTranslation('app');
  const commonStyles = { mb: theme.spacing(1) };

  return (
    <StyledGeolocation>
      <StyledLabelBoldLarge sx={commonStyles}>{t('geolocation')}</StyledLabelBoldLarge>
      <StyledTitleMedium sx={commonStyles}>{t('geolocationPrompt')}</StyledTitleMedium>
      <Button
        variant="contained"
        startIcon={<Svg id="geolocation" width="18" height="18" />}
        disabled
      >
        {t('geolocation')}
      </Button>
    </StyledGeolocation>
  );
};
