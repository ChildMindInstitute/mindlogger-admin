import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';

import {
  StyledAppletSettingsButton,
  StyledAppletSettingsDescription,
  StyledHeadline,
} from '../AppletSettings.styles';

export const EditAppletSetting = () => {
  const { t } = useTranslation('app');

  return (
    <>
      <StyledHeadline>{t('editApplet')}</StyledHeadline>
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
