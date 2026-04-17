import { Box, styled } from '@mui/material';

import { theme } from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';

export enum PasswordRequirementsSectionState {
  ERROR = 'error',
  FOCUSED = 'focused',
  MET = 'met',
}

const titleColorByState: Record<PasswordRequirementsSectionState, string> = {
  [PasswordRequirementsSectionState.ERROR]: variables.palette.error60,
  [PasswordRequirementsSectionState.FOCUSED]: variables.palette.onSurface,
  [PasswordRequirementsSectionState.MET]: variables.palette.green,
};

export const StyledSection = styled(Box)`
  margin-bottom: 0};
  text-align: left;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const StyledSectionTitle = styled('div') <{ state: PasswordRequirementsSectionState }>`
  font-size: ${variables.font.size.body2};
  font-weight: ${variables.font.weight.bold};
  line-height: ${variables.font.lineHeight.body2};
  color: ${({ state }) => titleColorByState[state]};
  margin-bottom: ${theme.spacing(0.4)};
`;

export const StyledGrid = styled(Box)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing(0.4, 1.6)};
`;

export const PasswordRequirementsFieldGroup = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'showPasswordPanel',
})<{ showPasswordPanel: boolean }>(({ showPasswordPanel }) => ({
  display: 'flex',
  flexDirection: 'column',
  '& > .password-requirements-panel': {
    minHeight: 0,
    overflow: 'hidden',
    transition:
      'opacity 0.2s ease-in-out, max-height 0.25s ease-in-out, margin-top 0.2s ease-in-out',
    ...(showPasswordPanel
      ? { opacity: 1, maxHeight: 320, marginTop: '5px' }
      : { opacity: 0, maxHeight: 0, marginTop: 0 }),
  },
}));

export const StyledRequirement = styled('div') <{ met: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing(0.4)};
  font-size: ${variables.font.size.body2};
  line-height: ${variables.font.lineHeight.body2};
  color: ${({ met }) => (met ? variables.palette.green : variables.palette.gray60)};
`;

export const StyledInfoIcon = styled('span')`
  display: inline-flex;
  align-items: center;
  cursor: pointer;

  && svg {
    fill: ${variables.palette.outline};
    width: 1.8rem;
    height: 1.8rem;
  }
`
  ;
