import { styled, Dialog, Box } from '@mui/material';

import { variables } from 'shared/styles/variables';

/**
 * Shared dialog styles for MFA-related modals
 */
export const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    display: flex;
    width: 480px;
    padding: 32px;
    flex-direction: column;
    align-items: flex-start;
    gap: 32px;
    border-radius: 16px;
    background: ${variables.palette.surface};
    overflow: hidden;
    max-height: none;
  }
`;

/**
 * Header container for dialog title and close button
 */
export const StyledHeader = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  align-self: stretch;
`;

/**
 * Dialog title styling
 */
export const StyledTitle = styled('h2')`
  margin: 0;
  flex: 1;
  color: ${variables.palette.on_surface};
  font-family: ${variables.font.family.title};
  font-size: 24px;
  font-weight: 400;
  font-style: normal;
  line-height: 32px;
  letter-spacing: 0%;
  opacity: 1;
`;

/**
 * Close button for dialogs (positioned absolutely)
 */
export const StyledCloseButton = styled('button')`
  position: absolute;
  right: 16px;
  top: 16px;
  display: flex;
  width: 48px;
  height: 48px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  border-radius: 100px;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  transition: background-color 0.2s ease;

  &:hover {
    background: ${variables.palette.on_surface_alpha8};
  }

  &:active {
    background: ${variables.palette.on_surface_alpha12};
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

/**
 * Content container for dialog body
 */
export const StyledContent = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  align-self: stretch;
  width: 100%;
`;

/**
 * Description text styling
 */
export const StyledDescription = styled(Box)`
  width: 100%;
  color: ${variables.palette.on_surface};
  font-family: ${variables.font.family.body};
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0.5px;
  opacity: 1;
`;

/**
 * Input container with error state support
 */
export const StyledInputContainer = styled('div')<{ $hasError?: boolean }>`
  display: flex;
  width: 300px;
  height: 56px;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  padding: ${({ $hasError }) => ($hasError ? '7px 15px' : '8px 16px')};
  border-radius: 4px;
  border: ${({ $hasError }) =>
    $hasError ? `2px solid ${variables.palette.error}` : `1px solid ${variables.palette.outline}`};
  background: ${variables.palette.surface};
  opacity: 1;
  position: relative;

  &:focus-within {
    border: 2px solid
      ${({ $hasError }) => ($hasError ? variables.palette.error : variables.palette.primary)};
    padding: 7px 15px;
  }
`;

/**
 * Input field styling
 */
export const StyledInput = styled('input')`
  width: 100%;
  height: 24px;
  padding: 0;
  border: none;
  background: transparent;
  color: ${variables.palette.on_surface};
  font-family: ${variables.font.family.input};
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0.15px;
  opacity: 1;

  &::placeholder {
    color: ${variables.palette.outline};
    opacity: 0.38;
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    opacity: 0.38;
    cursor: not-allowed;
  }
`;

/**
 * Button container for action buttons
 */
export const StyledButtonContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
`;

/**
 * Styled button with primary and secondary variants
 */
export const StyledButton = styled('button')`
  display: flex;
  width: 300px;
  height: 48px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 100px;
  border: none;
  text-align: center;
  font-family: ${variables.font.family.label};
  font-size: 16px;
  font-style: normal;
  line-height: 24px;
  letter-spacing: 0.15px;
  cursor: pointer;
  opacity: 1;
  transition: opacity 0.2s ease;

  &.primary {
    background: ${variables.palette.primary};
    color: ${variables.palette.on_primary};
    font-weight: 700;
  }

  &.secondary {
    background: transparent;
    color: ${variables.palette.primary};
    font-weight: 400;
  }

  &:disabled {
    opacity: 0.38;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    opacity: 0.8;
  }
`;

/**
 * Error message styling with animation
 */
export const StyledErrorMessage = styled('div')`
  margin-top: 4px;
  padding-left: 16px;
  color: ${variables.palette.error40};
  font-family: ${variables.font.family.body};
  font-size: 1.2rem;
  font-weight: 400;
  line-height: 1.66;
  letter-spacing: 0.03333em;
  text-align: left;
  animation: fadeIn 0.2s ease-in;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
