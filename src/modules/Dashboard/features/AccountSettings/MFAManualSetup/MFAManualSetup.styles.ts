import { styled, Dialog, Box } from '@mui/material';

import { variables } from 'shared/styles/variables';

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
  width: 100%;
  align-self: stretch;
  color: ${variables.palette.on_surface};
  font-family: ${variables.font.family.input};
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0.5px;
  opacity: 1;
`;

export const StyledDescriptionMultiLine = styled(Box)`
  width: 100%;
  align-self: stretch;
  color: ${variables.palette.on_surface};
  font-family: ${variables.font.family.input};
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0.5px;
  opacity: 1;
`;

export const StyledSecretKeyContainer = styled(Box)`
  display: flex;
  position: relative;
  width: 100%;
  align-self: stretch;
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
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
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
  width: 100%;
  height: 28px;
  color: ${variables.palette.on_surface};
  font-family: ${variables.font.family.input};
  font-size: 16px;
  font-weight: 400;
  font-style: normal;
  line-height: 28px;
  letter-spacing: 0;
  text-align: center;
  opacity: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
