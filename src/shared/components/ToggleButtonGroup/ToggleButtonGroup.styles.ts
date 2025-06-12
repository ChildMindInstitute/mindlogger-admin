import { Box, styled, ToggleButton, ToggleButtonGroup } from '@mui/material';

import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

import { ToggleButtonVariants } from './ToggleButtonGroup.types';

export const StyledIcon = styled(Box)`
  display: flex;
  ${({ variant }: { variant: ToggleButtonVariants }) =>
    variant === ToggleButtonVariants.Large ? 'margin-bottom: 0.8rem' : 'margin-right: 0.8rem'};

  svg {
    fill: ${({ variant }) =>
      variables.palette[
        variant === ToggleButtonVariants.Large ? 'primary50' : 'on_secondary_container'
      ]};
  }
`;

export const StyledToggleButtonGroup = styled(ToggleButtonGroup)`
  ${({ variant }: { variant: ToggleButtonVariants }) =>
    variant === ToggleButtonVariants.Large &&
    `
    width: 100%;
    gap: ${theme.spacing(2.4)};
    border-radius: 0;
  `}
`;

export const StyledToggleBtn = styled(ToggleButton, shouldForwardProp)`
  ${({ withIcon, variant }: { withIcon: boolean; variant: ToggleButtonVariants }) => {
    if (variant === ToggleButtonVariants.Large) {
      return `
        && {
          padding: ${theme.spacing(6.4, 2.4, 2.4)};
          height: auto;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-start;
          text-align: left;
          gap: ${theme.spacing(0.8)};
          transition: ${variables.transitions.bgColor};
        }

        &&,
        &&.MuiToggleButtonGroup-grouped:not(:last-of-type),
        &&.MuiToggleButtonGroup-grouped:not(:first-of-type) {
          border-radius: ${variables.borderRadius.lg2};
          border-color: ${variables.palette.surface_variant};

          &.Mui-selected {
            border-color: ${variables.palette.primary50};
            background-color: ${variables.palette.primary_alpha8};
          }
        }
      `;
    } else if (withIcon) {
      return `
        &.MuiToggleButton-root {
          border-color: ${variables.palette.surface_variant};
          padding: ${theme.spacing(1, 2)};
        }

        &.MuiToggleButton-root.MuiToggleButtonGroup-grouped:not(:first-of-type) {
          border-left-color: ${variables.palette.surface_variant};
        }

        &.MuiToggleButton-root.Mui-selected {
          font-weight: ${variables.font.weight.bold};
        }
      `;
    }
  }}
`;
