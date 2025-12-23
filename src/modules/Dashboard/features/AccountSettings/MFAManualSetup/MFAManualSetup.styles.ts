import { styled, Dialog, Box } from '@mui/material';

import { variables } from 'shared/styles/variables';

export const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    display: flex;
    width: 580px;
    padding: 32px;
    flex-direction: column;
    align-items: flex-start;
    gap: 32px;
    border-radius: 16px;
    background: ${variables.palette.surface};
  }
`;

export const StyledHeader = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  align-self: stretch;
`;

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
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  opacity: 1;

  svg {
    width: 24px;
    height: 24px;
  }

  &:hover {
    opacity: 0.7;
  }
`;

export const StyledContent = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  align-self: stretch;
  flex: 1;
  transition: all 0.3s ease-in-out;
`;

export const StyledDescription = styled(Box)`
  width: 516px;
  height: 24px;
  color: ${variables.palette.on_surface};
  font-family: ${variables.font.family.body};
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0.5px;
  vertical-align: middle;
  opacity: 1;
`;

export const StyledDescriptionMultiLine = styled(Box)`
  width: 516px;
  height: 48px;
  color: ${variables.palette.on_surface};
  font-family: ${variables.font.family.body};
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0.5px;
  vertical-align: middle;
  opacity: 1;
`;

export const StyledSecretKeyContainer = styled(Box)`
  display: flex;
  position: relative;
  width: 516px;
  height: 60px;
  padding-top: 16px;
  padding-bottom: 16px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 16px;
  background: ${variables.palette.surface1};
  opacity: 1;
  transition: background 0.2s ease-in-out;

  &:hover {
    background: ${variables.palette.surface2};
  }

  &:hover .copy-button {
    opacity: 1;
  }
`;

export const StyledCopyButton = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'copied',
})<{ copied?: boolean }>`
  position: absolute;
  right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 8px;
  color: ${({ copied }) =>
    copied ? variables.palette.primary : variables.palette.on_surface_variant};
  background: ${({ copied }) => (copied ? variables.palette.primary_container : 'transparent')};
  transition: all 0.2s ease-in-out;
  pointer-events: none;
  opacity: ${({ copied }) => (copied ? 1 : 0)};
`;

export const StyledSecretKey = styled(Box)`
  width: 516px;
  height: 28px;
  color: ${variables.palette.on_surface};
  font-family: ${variables.font.family.body};
  font-size: 20px;
  font-weight: 400;
  font-style: normal;
  line-height: 28px;
  letter-spacing: 0%;
  text-align: center;
  vertical-align: middle;
  opacity: 1;
`;

export const StyledInputContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== '$hasError',
})<{ $hasError?: boolean }>`
  display: flex;
  width: 300px;
  height: 56px;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  padding: 8px 16px;
  border-radius: 4px;
  gap: 10px;
  opacity: 1;
  border: ${({ $hasError }) =>
    $hasError ? `2px solid ${variables.palette.error}` : `1px solid ${variables.palette.outline}`};

  &:focus-within {
    border: 2px solid
      ${({ $hasError }) => ($hasError ? variables.palette.error : variables.palette.primary)};
    padding: 7px 15px;
  }
`;

export const StyledInput = styled('input')`
  width: 100%;
  height: 40px;
  padding: 0;
  border: none;
  background: transparent;
  color: ${variables.palette.on_surface};
  font-feature-settings:
    'liga' off,
    'clig' off;
  font-family: ${variables.font.family.input};
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 100%;
  letter-spacing: 0.15px;
  vertical-align: middle;
  opacity: 1;

  &::placeholder {
    color: ${variables.palette.outline};
    font-family: ${variables.font.family.input};
    font-size: 16px;
    font-weight: 400;
    line-height: 100%;
    letter-spacing: 0.15px;
    opacity: 1;
  }

  &:focus {
    outline: none;
  }
`;

export const StyledButtonContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  align-self: stretch;
`;

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
  background: ${variables.palette.primary};
  color: ${variables.palette.on_primary};
  text-align: center;
  font-family: ${variables.font.family.label};
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: 0.15px;
  cursor: pointer;
  padding: 10px 24px;
  opacity: 1;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.38;
    cursor: not-allowed;
  }

  &.secondary {
    width: 300px;
    height: 48px;
    background: transparent;
    border: none;
    border-radius: 100px;
    gap: 8px;
    padding: 10px 12px;
    color: ${variables.palette.primary};
    font-family: ${variables.font.family.label};
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
    letter-spacing: 0.15px;
    text-align: center;
    vertical-align: middle;
    opacity: 1;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const StyledErrorMessage = styled(Box)`
  margin-top: 4px;
  padding-left: 16px;
  color: ${variables.palette.error};
  font-family: ${variables.font.family.body};
  font-size: 1.2rem;
  font-weight: 400;
  line-height: 1.66;
  letter-spacing: 0.03333em;
  text-align: left;
  animation: fadeIn 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-8px);
      max-height: 0;
    }
    to {
      opacity: 1;
      transform: translateY(0);
      max-height: 100px;
    }
  }
`;
