import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { folders } from 'redux/modules';
import { TransferOwnership } from 'features/TransferOwnership';
import { StyledHeadlineLarge } from 'styles/styledComponents/Typography';
import { StyledAppletSettingsButton } from 'styles/styledComponents/AppletSettings';
import { SuccessTransferOwnershipPopup } from 'components/Popups';

import { StyledTransferOwnershipForm } from './TransferOwnershipSetting.styles';

export const TransferOwnershipSetting = () => {
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
      <StyledAppletSettingsButton variant="outlined" onClick={() => setIsSubmitted(true)}>
        {t('confirm')}
      </StyledAppletSettingsButton>
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
