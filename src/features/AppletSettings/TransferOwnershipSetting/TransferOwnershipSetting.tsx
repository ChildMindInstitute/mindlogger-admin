import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';

import { folders } from 'redux/modules';
import { TransferOwnership } from 'features/Applet/TransferOwnership';
import { StyledHeadlineLarge } from 'styles/styledComponents/Typography';
import { SuccessTransferOwnershipPopup } from 'features/Applet/Popups';
import { Tooltip } from 'components';

import { StyledAppletSettingsButton } from '../AppletSettings.styles';
import { StyledTransferOwnershipForm } from './TransferOwnershipSetting.styles';

export const TransferOwnershipSetting = ({ isDisabled = false }) => {
  const { t } = useTranslation('app');
  const { id } = useParams();
  const applet = folders.useApplet(id as string);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailTransfered, setEmailTransfered] = useState('');
  const [transferOwnershipPopupVisible, setTransferOwnershipPopupVisible] = useState(false);

  useEffect(() => {
    if (emailTransfered) {
      setTransferOwnershipPopupVisible(true);
    }
  }, [emailTransfered]);

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
