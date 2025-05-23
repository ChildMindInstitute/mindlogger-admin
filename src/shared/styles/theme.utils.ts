import { ChipOwnProps } from '@mui/material';

import { variables } from './variables';

export const getChipStyleOverrides = ({
  color,
  variant,
}: {
  color?: ChipOwnProps['color'];
  variant?: ChipOwnProps['variant'];
}) => {
  const isFilled = variant === 'filled';
  const key = isFilled ? 'backgroundColor' : 'borderColor';

  switch (color) {
    case 'default':
    case 'secondary':
      return {
        color: variables.palette.on_secondary_container,
        [key]: variables.palette.on_surface_variant_alfa8,

        // MUI applies tabindex to make Chip's focusable when they receive
        // `onDelete` or`onClick` props. This selector (and the repeated ones
        // below) conditionally applies hover styles _only_ to interactive chips.
        '&[tabindex="0"]:hover': {
          borderColor: variables.palette.neutral60,
          backgroundColor: variables.palette[isFilled ? 'neutral60' : 'inverse_on_surface'],
        },
      };
    case 'primary':
      return {
        color: variables.palette.on_secondary_container,
        [key]: variables.palette.primary95,

        '&[tabindex="0"]:hover': {
          borderColor: variables.palette.primary_container,
          backgroundColor: isFilled ? variables.palette.primary_container : undefined,
        },
      };
    case 'success':
      return {
        color: variables.palette.on_secondary_container,
        [key]: variables.palette.green_light,

        '&[tabindex="0"]:hover': {
          borderColor: variables.palette.green,
          backgroundColor: isFilled ? variables.palette.green : undefined,
        },
      };
    case 'warning':
      return {
        color: variables.palette.on_secondary_container,
        [key]: variables.palette.yellow_light,

        '&[tabindex="0"]:hover': {
          borderColor: variables.palette.semantic.yellow,
          backgroundColor: isFilled ? variables.palette.semantic.yellow : undefined,
        },
      };
    case 'error':
      return {
        color: variables.palette.on_error_container,
        [key]: variables.palette.error_container,

        '&[tabindex="0"]:hover': {
          borderColor: variables.palette.on_surface_variant_alfa8,
          backgroundColor: isFilled ? variables.palette.on_surface_variant_alfa8 : undefined,
        },
      };
    case 'infoAlt':
      return {
        color: variables.palette.on_secondary_container,
        [key]: variables.palette.purple_alfa30,

        '&[tabindex="0"]:hover': {
          borderColor: variables.palette.purple_alfa30,
          backgroundColor: isFilled ? variables.palette.purple_alfa30 : undefined,
        },
      };
    default:
      return {};
  }
};
