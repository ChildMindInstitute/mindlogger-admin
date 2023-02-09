import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { StyledHeadlineLarge } from 'styles/styledComponents/Typography';
import { AppletPasswordPopup } from 'features/Applet/Popups';
import { Svg } from 'components';

import {
  StyledAppletSettingsButton,
  StyledAppletSettingsDescription,
} from '../AppletSettings.styles';

export const ExportDataSetting = () => {
  const { t } = useTranslation('app');
  const { id } = useParams();

  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  return (
    <>
      <StyledHeadlineLarge>{t('exportData')}</StyledHeadlineLarge>
      <StyledAppletSettingsDescription>{t('exportDescription')}</StyledAppletSettingsDescription>
      <StyledAppletSettingsButton
        onClick={() => setPasswordModalVisible(true)}
        variant="outlined"
        startIcon={<Svg width="18" height="18" id="export" />}
      >
        {t('download')}
      </StyledAppletSettingsButton>
      {passwordModalVisible && (
        <AppletPasswordPopup
          popupVisible={passwordModalVisible}
          onClose={() => setPasswordModalVisible(false)}
          appletId={id}
        />
      )}
    </>
  );
};
