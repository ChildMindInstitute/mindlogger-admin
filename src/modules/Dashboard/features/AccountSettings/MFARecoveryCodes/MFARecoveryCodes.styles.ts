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
    overflow: hidden;
    max-height: none;
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
  align-items: flex-start;
  gap: 32px;
  align-self: stretch;
  width: 100%;
`;

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

  p {
    margin: 0 0 16px 0;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

export const StyledCodesContainer = styled(Box)`
  display: flex;
  width: 100%;
  padding: 16px 0;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  background: ${variables.palette.surface1};
  opacity: 1;
`;

export const StyledCodesList = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 416px;
  color: ${variables.palette.on_surface};
  font-family: ${variables.font.family.body};
  font-size: 20px;
  font-weight: 400;
  font-style: normal;
  line-height: 28px;
  letter-spacing: 0%;
  text-align: center;
  opacity: 1;

  p {
    margin: 0;
  }
`;

export const StyledButtonContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
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
    border: 1px solid ${variables.palette.outline};
    border-radius: 100px;
    gap: 8px;
    padding: 10px 24px;
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
      background: ${variables.palette.surface1};
    }
  }
`;
