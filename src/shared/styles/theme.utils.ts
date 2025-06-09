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
        [key]: variables.palette.on_surface_variant_alpha8,

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
        [key]: variables.palette.primary[95],

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
          borderColor: variables.palette.yellow,
          backgroundColor: isFilled ? variables.palette.yellow : undefined,
        },
      };
    case 'error':
      return {
        color: variables.palette.on_error_container,
        [key]: variables.palette.error_container,

        '&[tabindex="0"]:hover': {
          borderColor: variables.palette.on_surface_variant_alpha8,
          backgroundColor: isFilled ? variables.palette.on_surface_variant_alpha8 : undefined,
        },
      };
    case 'infoAlt':
      return {
        color: variables.palette.on_secondary_container,
        [key]: variables.palette.purple_alpha30,

        '&[tabindex="0"]:hover': {
          borderColor: variables.palette.purple_alpha30,
          backgroundColor: isFilled ? variables.palette.purple_alpha30 : undefined,
        },
      };
    default:
      return {};
  }
};

/**
 * Converts a hex color to RGB components
 * @param hex The hex color to convert (e.g., "#RRGGBB" or "#RGB")
 * @returns An object with r, g, b components or null if invalid
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // Remove the # if present
  hex = hex.replace(/^#/, '');

  // Parse the hex value based on length
  let r: number, g: number, b: number;

  if (hex.length === 3) {
    // #RGB format
    r = parseInt(hex.charAt(0) + hex.charAt(0), 16);
    g = parseInt(hex.charAt(1) + hex.charAt(1), 16);
    b = parseInt(hex.charAt(2) + hex.charAt(2), 16);
  } else if (hex.length === 6) {
    // #RRGGBB format
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else {
    return null; // Invalid hex color
  }

  return { r, g, b };
}

/**
 * Creates an rgba color string from a hex color and alpha value
 * @param hex The hex color to convert
 * @param alpha The alpha value (0-1)
 * @returns An rgba color string or the original hex if conversion fails
 */
export function hexToRgba(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

/**
 * Flattens a palette object by prefixing each color with a given prefix
 * @param paletteObject The palette object to flatten
 * @param prefix The prefix to add to each color
 * @returns A flattened palette object
 */
export function flattenPaletteObject<T extends Record<string | number, string>>(
  paletteObject: T,
  prefix: string,
): Record<string, string> {
  const result: Record<string, string> = {};

  // Add the default color with just the prefix as the key
  result[prefix] = paletteObject.default || paletteObject[40] || '';

  // Add all other colors with the prefix + key as the key
  Object.entries(paletteObject).forEach(([key, value]) => {
    if (key !== 'main' && key !== 'default') {
      const formattedKey = /^\d+$/.test(key) ? `${prefix}${key}` : `${prefix}_${key}`;
      result[formattedKey] = value;
    }
  });

  return result;
}
