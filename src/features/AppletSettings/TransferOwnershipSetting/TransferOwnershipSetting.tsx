import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';

import { FolderApplet, folders } from 'redux/modules';
import { TransferOwnership } from 'modules/Dashboard/features/Applet/TransferOwnership';
import { StyledHeadlineLarge } from 'styles/styledComponents/Typography';
import { SuccessTransferOwnershipPopup } from 'modules/Dashboard/features/Applet/Popups';
import { Tooltip } from 'components';

import { StyledAppletSettingsButton } from '../AppletSettings.styles';
import { StyledTransferOwnershipForm } from './TransferOwnershipSetting.styles';

export const TransferOwnershipSetting = ({ isDisabled = false }) => {
  const { t } = useTranslation('app');
  const { id } = useParams();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailTransfered, setEmailTransfered] = useState('');
  const [transferOwnershipPopupVisible, setTransferOwnershipPopupVisible] = useState(false);
  const [applet, setApplet] = useState<FolderApplet | null>(null);

  useEffect(() => {
    if (emailTransfered) {
      setTransferOwnershipPopupVisible(true);
    }
  }, [emailTransfered]);

  useEffect(() => {
    if (id) {
      setApplet(folders.useApplet(id));
    }
  }, [id]);

  return (
    <>
      <StyledHeadlineLarge>{t('transferOwnership')}</StyledHeadlineLarge>
      <StyledTransferOwnershipForm>
        <TransferOwnership
          applet={applet}
          isSubmitted={isSubmitted}
          setIsSubmitted={setIsSubmitted}
          setEmailTransfered={setEmailTransfered}
        />
      </StyledTransferOwnershipForm>
      <Tooltip tooltipTitle={isDisabled ? t('needToCreateApplet') : undefined}>
        <Box sx={{ width: 'fit-content' }}>
          <StyledAppletSettingsButton
            variant="outlined"
            onClick={() => setIsSubmitted(true)}
            disabled={isDisabled}
          >
            {t('confirm')}
          </StyledAppletSettingsButton>
        </Box>
      </Tooltip>
      {transferOwnershipPopupVisible && (
        <SuccessTransferOwnershipPopup
          email={emailTransfered}
          transferOwnershipPopupVisible={transferOwnershipPopupVisible}
          setTransferOwnershipPopupVisible={setTransferOwnershipPopupVisible}
        />
      )}
    </>
  );
};
