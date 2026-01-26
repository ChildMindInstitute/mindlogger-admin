import { useState } from 'react';

import { Svg } from 'shared/components';
import { StyledTitleSmall } from 'shared/styles';

import {
  StyledDialog,
  StyledDialogContent,
  StyledHeader,
  StyledCloseButton,
  StyledTabsContainer,
  StyledTab,
  StyledBannerContainer,
} from './AccountSettings.styles';
import { AccountTab } from './AccountTab';
import { AccountSettingsProps } from './AccountSettings.types';
import { InlineBanner } from './AccountTab/InlineBanner';

export const AccountSettings = ({ open, onClose }: AccountSettingsProps) => {
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);

  const showBanner = (message: string) => {
    setBannerMessage(message);
  };

  const hideBanner = () => {
    setBannerMessage(null);
  };

  const handleClose = () => {
    // Remove focus from any focused element before closing to prevent aria-hidden focus warning
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    onClose();
  };

  return (
    <StyledDialog open={open} onClose={handleClose} maxWidth="md" fullWidth disableRestoreFocus>
      <StyledHeader>
        <StyledCloseButton onClick={handleClose}>
          <Svg id="close" />
        </StyledCloseButton>
      </StyledHeader>
      <StyledTabsContainer>
        <StyledTab>
          <StyledTitleSmall>Account</StyledTitleSmall>
        </StyledTab>
      </StyledTabsContainer>
      {bannerMessage && (
        <StyledBannerContainer>
          <InlineBanner message={bannerMessage} duration={5000} onClose={hideBanner} />
        </StyledBannerContainer>
      )}
      <StyledDialogContent hasBanner={!!bannerMessage}>
        <AccountTab isModalOpen={open} onShowBanner={showBanner} />
      </StyledDialogContent>
    </StyledDialog>
  );
};
