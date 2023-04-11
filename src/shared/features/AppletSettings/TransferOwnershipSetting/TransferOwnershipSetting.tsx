import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';

import { StyledHeadlineLarge } from 'shared/styles/styledComponents';
import {
  SuccessTransferOwnershipPopup,
  TransferOwnership,
} from 'modules/Dashboard/features/Applet';
import { Tooltip } from 'shared/components';
import { SingleApplet } from 'shared/state';
import { FolderApplet } from 'modules/Dashboard/state';
import { TransferOwnershipRef } from 'modules/Dashboard/features/Applet/TransferOwnership/TransferOwnership.types';

import { StyledTransferOwnershipForm } from './TransferOwnershipSetting.styles';
import { StyledAppletSettingsButton } from '../AppletSettings.styles';
import { useAppletDataOrFolderData } from './TransferOwnershipSetting.hooks';

export const TransferOwnershipSetting = ({ isDisabled = false, isBuilder = false }) => {
  const { t } = useTranslation('app');
  const { appletId } = useParams();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailTransfered, setEmailTransfered] = useState('');
  const [transferOwnershipPopupVisible, setTransferOwnershipPopupVisible] = useState(false);
  const appletData = useAppletDataOrFolderData(appletId, isBuilder);
  const transferOwnershipRef = useRef<TransferOwnershipRef | null>(null);

  useEffect(() => {
    if (!emailTransfered) return;

    setTransferOwnershipPopupVisible(true);
  }, [emailTransfered]);

  return (
    <>
      <StyledHeadlineLarge>{t('transferOwnership')}</StyledHeadlineLarge>
      <StyledTransferOwnershipForm>
        <TransferOwnership
          ref={transferOwnershipRef}
          appletId={appletData?.id}
          appletName={
            (appletData as SingleApplet)?.displayName ?? (appletData as FolderApplet)?.name
          }
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
          closeTransferOwnershipPopup={() => {
            setTransferOwnershipPopupVisible(false);
            transferOwnershipRef.current?.resetEmail();
          }}
        />
      )}
    </>
  );
};
