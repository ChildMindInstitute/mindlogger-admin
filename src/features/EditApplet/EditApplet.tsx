import { useTranslation } from 'react-i18next';

import { Svg } from 'components/Svg';
import { StyledHeadlineLarge } from 'styles/styledComponents/Typography';
import {
  StyledAppletSettingsButton,
  StyledAppletSettingsDescription,
} from 'styles/styledComponents/AppletSettings';

export const EditApplet = () => {
  const { t } = useTranslation('app');

  return (
    <>
      <StyledHeadlineLarge>{t('editApplet')}</StyledHeadlineLarge>
      <StyledAppletSettingsDescription>{t('editDescription')}</StyledAppletSettingsDescription>
      <StyledAppletSettingsButton
        variant="outlined"
        startIcon={<Svg width="18" height="18" id="edit-applet" />}
      >
        {t('editAppletInBuilder')}
      </StyledAppletSettingsButton>
    </>
  );
};
