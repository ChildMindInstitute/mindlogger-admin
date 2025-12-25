import { Svg } from 'shared/components';
import { StyledTitleSmall } from 'shared/styles';

import {
  StyledDialog,
  StyledDialogContent,
  StyledHeader,
  StyledCloseButton,
  StyledTabsContainer,
  StyledTab,
} from './AccountSettings.styles';
import { AccountTab } from './AccountTab';
import { AccountSettingsProps } from './AccountSettings.types';

export const AccountSettings = ({ open, onClose }: AccountSettingsProps) => {
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
      <StyledDialogContent>
        <AccountTab isModalOpen={open} />
      </StyledDialogContent>
    </StyledDialog>
  );
};
