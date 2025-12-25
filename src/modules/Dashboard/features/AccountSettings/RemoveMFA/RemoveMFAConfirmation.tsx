import React from 'react';

import { Svg } from 'shared/components/Svg';

import {
  StyledDialog,
  StyledHeader,
  StyledTitle,
  StyledCloseButton,
  StyledContent,
  StyledDescription,
  StyledButtonContainer,
  StyledButton,
} from './RemoveMFAConfirmation.styles';
import { RemoveMFAConfirmationProps } from './RemoveMFAConfirmation.types';

export const RemoveMFAConfirmation: React.FC<RemoveMFAConfirmationProps> = ({
  open,
  onClose,
  onConfirm,
  isLoading = false,
}) => (
  <StyledDialog open={open} onClose={onClose} maxWidth={false}>
    <StyledHeader>
      <StyledTitle>Remove 2F Authentication</StyledTitle>
      <StyledCloseButton onClick={onClose} disabled={isLoading} type="button">
        <Svg id="close" width={24} height={24} />
      </StyledCloseButton>
    </StyledHeader>

    <StyledContent>
      <StyledDescription>
        Are you sure you want to remove two factor authentication from this account? You can add it
        again later.
      </StyledDescription>

      <StyledButtonContainer>
        <StyledButton className="primary" onClick={onConfirm} disabled={isLoading} type="button">
          {isLoading ? 'Removing...' : 'Remove'}
        </StyledButton>

        <StyledButton className="secondary" onClick={onClose} disabled={isLoading} type="button">
          Cancel
        </StyledButton>
      </StyledButtonContainer>
    </StyledContent>
  </StyledDialog>
);
