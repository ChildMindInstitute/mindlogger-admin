import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';

import { FolderApplet, folders } from 'modules/Dashboard/state';
import { StyledHeadlineLarge } from 'shared/styles/styledComponents';
import {
  SuccessTransferOwnershipPopup,
  TransferOwnership,
} from 'modules/Dashboard/features/Applet';
import { Tooltip } from 'shared/components';

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
