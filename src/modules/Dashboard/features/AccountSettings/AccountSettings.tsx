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

export const AccountSettings = ({ open, onClose }: AccountSettingsProps) => (
  <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
    <StyledHeader>
      <StyledCloseButton onClick={onClose}>
        <Svg id="close" />
      </StyledCloseButton>
    </StyledHeader>
    <StyledTabsContainer>
      <StyledTab>
        <StyledTitleSmall>Account</StyledTitleSmall>
      </StyledTab>
    </StyledTabsContainer>
    <StyledDialogContent>
      <AccountTab />
    </StyledDialogContent>
  </StyledDialog>
);
