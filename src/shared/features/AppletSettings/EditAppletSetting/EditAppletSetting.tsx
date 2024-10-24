import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components/Svg';
import { getBuilderAppletUrl } from 'shared/utils/urlGenerator';
import { Mixpanel, MixpanelEventType, MixpanelProps } from 'shared/utils/mixpanel';

import {
  StyledAppletSettingsButton,
  StyledAppletSettingsDescription,
} from '../AppletSettings.styles';

export const EditAppletSetting = () => {
  const { t } = useTranslation('app');
  const navigate = useNavigate();
  const { appletId } = useParams();

  const handleClick = () => {
    navigate(getBuilderAppletUrl(appletId || ''));
    Mixpanel.track({
      action: MixpanelEventType.AppletEditClick,
      [MixpanelProps.AppletId]: appletId,
    });
  };

  return (
    <>
      <StyledAppletSettingsDescription>{t('editDescription')}</StyledAppletSettingsDescription>
      <StyledAppletSettingsButton
        variant="outlined"
        startIcon={<Svg width="18" height="18" id="edit-applet" />}
        onClick={handleClick}
        data-testid="applet-settings-edit-applet-edit"
      >
        {t('editAppletInBuilder')}
      </StyledAppletSettingsButton>
    </>
  );
};
