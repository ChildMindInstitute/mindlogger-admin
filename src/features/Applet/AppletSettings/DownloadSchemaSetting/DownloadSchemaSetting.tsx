import { useTranslation } from 'react-i18next';

import { Svg } from 'components/Svg';
import { StyledHeadlineLarge } from 'styles/styledComponents/Typography';

import {
  StyledAppletSettingsButton,
  StyledAppletSettingsDescription,
} from '../AppletSettings.styles';

export const DownloadSchemaSetting = () => {
  const { t } = useTranslation('app');

  return (
    <>
      <StyledHeadlineLarge>{t('downloadSchema')}</StyledHeadlineLarge>
      <StyledAppletSettingsDescription>{t('downloadDescription')}</StyledAppletSettingsDescription>
      <StyledAppletSettingsButton
        variant="outlined"
        startIcon={<Svg width="18" height="18" id="export" />}
      >
        {t('download')}
      </StyledAppletSettingsButton>
    </>
  );
};
