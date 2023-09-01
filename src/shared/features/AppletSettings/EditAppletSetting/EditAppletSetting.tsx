import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import { getBuilderAppletUrl } from 'shared/utils';

import {
  StyledAppletSettingsButton,
  StyledAppletSettingsDescription,
} from '../AppletSettings.styles';

export const EditAppletSetting = () => {
  const { t } = useTranslation('app');
  const navigate = useNavigate();
  const { appletId } = useParams();

  return (
    <>
      <StyledAppletSettingsDescription>{t('editDescription')}</StyledAppletSettingsDescription>
      <StyledAppletSettingsButton
        variant="outlined"
        startIcon={<Svg width="18" height="18" id="edit-applet" />}
        onClick={() => navigate(getBuilderAppletUrl(appletId || ''))}
        data-testid="applet-settings-edit-applet-edit"
      >
        {t('editAppletInBuilder')}
      </StyledAppletSettingsButton>
    </>
  );
};
