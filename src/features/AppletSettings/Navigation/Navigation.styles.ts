import { Box } from '@mui/material';
import { styled } from '@mui/system';

import { variables } from 'styles/variables';
import theme from 'styles/theme';
import { StyledHeadlineLarge, StyledTitleSmall, StyledFlexColumn } from 'styles/styledComponents';
import { shouldForwardProp } from 'utils/shouldForwardProp';

export const StyledContainer = styled(StyledFlexColumn)`
  padding: ${theme.spacing(4.8, 6.4, 0)};
  flex: 1 1 30%;
  min-width: max-content;
  height: 100%;
  overflow-y: auto;
`;

export const StyledHeadline = styled(StyledHeadlineLarge)`
  padding-bottom: ${theme.spacing(2.4)};
`;

export const StyledSettingsGroup = styled(Box, shouldForwardProp)`
  padding: ${theme.spacing(0.8, 0)};
  border-top: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};

  ${({ isCompact }: { isCompact: boolean }) =>
    isCompact &&
    `
    padding: ${theme.spacing(1.2, 0)};
    border-top: unset;
  `};
`;

export const StyledSettings = styled(Box, shouldForwardProp)`
  display: flex;
  margin-left: ${theme.spacing(12)};

  ${({ isCompact }: { isCompact: boolean }) =>
    isCompact &&
    `
    margin: ${theme.spacing(1.6)};
    border-left: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
    flex-direction: column;
  `};
`;

export const StyledSetting = styled(StyledFlexColumn, shouldForwardProp)`
  justify-content: flex-end;
  flex-basis: 12rem;
  align-items: center;
  width: 12rem;
  height: 12rem;
  padding: ${theme.spacing(0, 2.6, 1.2)};
  text-align: center;
  cursor: pointer;
  border-radius: ${variables.borderRadius.lg};

  :hover {
    background-color: ${variables.palette.on_surface_alfa12};
  }
  svg {
    fill: ${variables.palette.on_surface_variant};
  }

  ${({ isCompact }: { isSelected: boolean; isCompact: boolean }) =>
    isCompact &&
    `
    flex-basis: unset;
    flex-direction: row;
    justify-content: flex-start;
    width: 27.5rem;
    height: 5.6rem;
    padding: ${theme.spacing(0, 1.8)};
    margin: ${theme.spacing(0.2, 0, 0, 1.6)};
    border-radius: ${variables.borderRadius.xxxl};

    svg {
      margin-right: ${theme.spacing(1.6)};
    }
    p {
      margin-top: 0;
    }
    :hover {
      background-color: ${variables.palette.on_surface_alfa12};
    }
    
`};

  ${({ isSelected }: { isSelected: boolean }) =>
    isSelected &&
    `
    background-color: ${variables.palette.secondary_container};

    p {
      font-weight: ${variables.font.weight.bold};
      color: ${variables.palette.on_secondary_container};
    }
    :hover {
      background-color: ${variables.palette.secondary_container};
      svg {
        fill: ${variables.palette.primary};
      }
    };
  `};
`;

export const StyledTitle = styled(StyledTitleSmall)`
  margin-top: ${theme.spacing(1)};
`;
