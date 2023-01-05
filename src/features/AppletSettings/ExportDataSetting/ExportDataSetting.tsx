import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { StyledHeadlineLarge } from 'styles/styledComponents/Typography';
import { AppletPwd, EnterAppletPwd } from 'components/Popups';
import { Svg } from 'components/Svg';
import { account, folders } from 'redux/modules';
import { getAppletEncryptionInfo } from 'utils/encryption';
import { getAppletData } from 'utils/getAppletData';

import {
  StyledAppletSettingsButton,
  StyledAppletSettingsDescription,
} from '../AppletSettings.styles';

export const ExportDataSetting = () => {
  const { t } = useTranslation('app');
  const { id } = useParams();
  const accData = account.useData();
  const appletsFoldersData = folders.useFlattenFoldersApplets();

  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [errorText, setErrorText] = useState('');

  const handleClose = () => {
    setPasswordModalVisible(false);
    setErrorText('');
  };

  const handleSubmit = ({ appletPassword }: AppletPwd) => {
    const { encryption } = getAppletData(appletsFoldersData, id);
    const encryptionInfo = getAppletEncryptionInfo({
      appletPassword,
      accountId: accData?.account.accountId || '',
      prime: encryption?.appletPrime || [],
      baseNumber: encryption?.base || [],
    });

    if (
      encryptionInfo
        .getPublicKey()
        .equals(Buffer.from(encryption?.appletPublicKey as unknown as WithImplicitCoercion<string>))
    ) {
      handleClose();
    } else {
      setErrorText(t('incorrectAppletPassword') as string);
    }
  };

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
        <EnterAppletPwd
          open={passwordModalVisible}
          onClose={() => handleClose()}
          onSubmit={handleSubmit}
          errorText={errorText}
        />
      )}
    </>
  );
};
