import { styled, Dialog, Box } from '@mui/material';

import { variables, StyledBodyLarge } from 'shared/styles';

export const StyledDialog = styled(Dialog)`
  .MuiPaper-root {
    background: ${variables.palette.surface};
    border-radius: 16px;
    max-width: 496px;
    width: 100%;
    padding: 32px;
    box-shadow: none;
  }

  .MuiBackdrop-root {
    background-color: ${variables.palette.black}80;
  }
`;

export const StyledHeader = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  position: relative;
`;

export const StyledTitle = styled('h2')`
  font-family: ${variables.font.family.title};
  font-size: 24px;
  font-weight: 400;
  line-height: 32px;
  color: ${variables.palette.on_surface};
  margin: 0;
  flex: 1;
  padding-right: 48px;
`;

export const StyledCloseButton = styled('button')`
  position: absolute;
  top: -16px;
  right: -16px;
  width: 48px;
  height: 48px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-center;
  padding: 8px;
  border-radius: 100px;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${variables.palette.surface_variant};
  }

  &:focus {
    outline: 2px solid ${variables.palette.primary};
    outline-offset: 2px;
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

export const StyledContent = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export const StyledDescription = styled(StyledBodyLarge)`
  color: ${variables.palette.on_surface};
  margin: 0;
  line-height: 24px;
`;

export const StyledButtonContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
`;

export const StyledButton = styled('button')`
  width: 300px;
  height: 48px;
  border-radius: 100px;
  font-family: ${variables.font.family.label};
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.15px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  padding: 10px 24px;
  display: flex;
  align-items: center;
  justify-center;

  &.primary {
    background: ${variables.palette.error};
    color: ${variables.palette.on_primary};
    font-weight: 700;

    &:hover:not(:disabled) {
      background: ${variables.palette.error30};
      box-shadow: 0 2px 4px ${variables.palette.error40}4D;
    }

    &:focus {
      outline: 2px solid ${variables.palette.error};
      outline-offset: 2px;
    }

    &:disabled {
      opacity: 0.38;
      cursor: not-allowed;
    }
  }

  &.secondary {
    background: transparent;
    color: ${variables.palette.primary};
    font-weight: 400;

    &:hover:not(:disabled) {
      background: ${variables.palette.surface_variant};
    }

    &:focus {
      outline: 2px solid ${variables.palette.primary};
      outline-offset: 2px;
    }

    &:disabled {
      opacity: 0.38;
      cursor: not-allowed;
    }
  }
`;
