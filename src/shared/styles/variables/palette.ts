import { flattenPaletteObject, hexToRgba } from '../theme.utils';

type BasePalette = Record<string, Record<string | number, string>>;
export interface Palette {
  [key: string]: string;
}

/**
 * This references all base "primitive" colors.
 * These colors will be used to give values to
 * semantic colors, like "on_container".
 */
const basePalette: BasePalette = {
  primary: {
    // Main primary color falls under primary[3]
    // For the rest of the colors, the default value is [40]
    default: '#0B0907',
    0: '#000',
    10: '#1D1B19',
    20: '#32302D',
    30: '#484744',
    40: '#5F5E5B',
    50: '#787773',
    60: '#91918E',
    70: '#ACABA9',
    80: '#C6C6C5',
    90: '#E3E2E1',
    95: '#F1F0EF',
    99: '#FDFCFC',
    100: '#FFF',
  },
  secondary: {
    0: '#000',
    10: '#041847',
    20: '#182D65',
    30: '#173F9F',
    40: '#004CED',
    50: '#216DFF',
    60: '#3C90FF',
    70: '#55B1FF',
    80: '#8BCEFF',
    90: '#CAE6FF',
    95: '#E5F3FF',
    99: '#FBFCFF',
    100: '#FFF',
  },
  tertiary: {
    0: '#000',
    10: '#320F1D',
    20: '#4B2432',
    30: '#6B364A',
    40: '#944262',
    50: '#AF5C82',
    60: '#CA779E',
    70: '#D69AB8',
    80: '#E5BCD1',
    90: '#F0DAE5',
    95: '#F9EEF4',
    99: '#FFFBFF',
    100: '#FFF',
  },
  error: {
    0: '#000',
    10: '#410002',
    20: '#690004',
    30: '#930009',
    40: '#BA1A1A',
    50: '#DE3730',
    60: '#FF5449',
    70: '#FE897D',
    80: '#FFB4AB',
    90: '#FFDAD6',
    95: '#FFEDEA',
    99: '#FFFBFF',
    100: '#FFF',
  },
  neutral: {
    0: '#000',
    10: '#1D1B19',
    20: '#32302D',
    30: '#484744',
    40: '#5F5E5B',
    50: '#787773',
    60: '#91918E',
    70: '#ACABA9',
    80: '#C6C6C5',
    90: '#E3E2E1',
    95: '#F1F0EF',
    99: '#FDFCFC',
    100: '#FFF',
  },
  neutral_variant: {
    0: '#000',
    10: '#1D1B19',
    20: '#32302D',
    30: '#484744',
    40: '#5F5E5B',
    50: '#787773',
    60: '#91918E',
    70: '#ACABA9',
    80: '#C6C6C5',
    90: '#E3E2E1',
    95: '#F1F0EF',
    99: '#FDFCFC',
    100: '#FFF',
  },
  surface: {
    1: '#F5F4F4',
    2: '#F0EFEF',
    3: '#ECEBEA',
    4: '#EAE9E9',
    5: '#E7E6E5',
  },
  blue: {
    default: '#0152FD',
    light: '#B3CBFE',
  },
  brown: {
    default: '#79403C',
    light: '#D6C6C4',
  },
  gray: {
    default: '#787773',
    light: '#D6D6D5',
  },
  green: {
    default: '#386348',
    light: '#C3D0C8',
  },
  orange: {
    default: '#E65838',
    light: '#F7CDC3',
  },
  pink: {
    default: '#A75276',
    light: '#E6CCD7',
  },
  yellow: {
    default: '#DAB417',
    light: '#F4E8BA',
  },
  purple: {
    default: '#6C4E9B',
    light: '#D3CAE1',
  },
  red: {
    default: '#B83236',
    light: '#EAC1C3',
  },
};

/**
 * This contains all flattened palette colors with its tonal variants,
 * as well as all semantic colors (on_container, container, etc).
 */
export const semanticPalette: Palette = {
  ...flattenPaletteObject({ ...basePalette.primary }, 'primary'),
  on_primary: basePalette.primary[100],
  primary_container: basePalette.primary[90],
  on_primary_container: basePalette.primary[10],
  primary_fixed: basePalette.primary[90],
  on_primary_fixed: basePalette.primary[10],
  primary_fixed_dim: basePalette.primary[80],
  on_primary_fixed_variant: basePalette.primary[30],

  ...flattenPaletteObject({ ...basePalette.secondary }, 'secondary'),
  on_secondary: basePalette.secondary[100],
  secondary_container: basePalette.secondary[90],
  on_secondary_container: basePalette.secondary[0],
  secondary_fixed: basePalette.secondary[90],
  on_secondary_fixed: basePalette.secondary[10],
  secondary_fixed_dim: basePalette.secondary[80],
  on_secondary_fixed_variant: basePalette.secondary[30],

  ...flattenPaletteObject({ ...basePalette.tertiary }, 'tertiary'),
  on_tertiary: basePalette.tertiary[100],
  tertiary_container: basePalette.tertiary[90],
  on_tertiary_container: basePalette.tertiary[10],
  tertiary_fixed: basePalette.tertiary[90],
  on_tertiary_fixed: basePalette.tertiary[10],
  tertiary_fixed_dim: basePalette.tertiary[80],
  on_tertiary_fixed_variant: basePalette.tertiary[30],

  ...flattenPaletteObject({ ...basePalette.error }, 'error'),
  on_error: basePalette.error[100],
  error_container: basePalette.error[90],
  on_error_container: basePalette.error[10],

  ...flattenPaletteObject({ ...basePalette.neutral }, 'neutral'),
  ...flattenPaletteObject({ ...basePalette.neutral }, 'neutral_variant'),

  ...flattenPaletteObject({ ...basePalette.surface }, 'surface'),
  surface: basePalette.neutral[99],
  on_surface: basePalette.neutral[10],
  surface_variant: basePalette.neutral_variant[90],
  on_surface_variant: basePalette.neutral_variant[30],

  inverse_surface: basePalette.neutral[20],
  inverse_on_surface: basePalette.neutral[95],
  inverse_primary: basePalette.primary[80],

  outline: basePalette.neutral_variant[50],
  outline_variant: basePalette.neutral_variant[80],

  outline_variant2: '#c2c7cF',

  dark_error_container: '#93000a',

  black: '#000',
  white: '#FFF',
  ...flattenPaletteObject({ ...basePalette.blue }, 'blue'),
  ...flattenPaletteObject({ ...basePalette.brown }, 'brown'),
  ...flattenPaletteObject({ ...basePalette.gray }, 'gray'),
  ...flattenPaletteObject({ ...basePalette.green }, 'green'),
  ...flattenPaletteObject({ ...basePalette.orange }, 'orange'),
  ...flattenPaletteObject({ ...basePalette.pink }, 'pink'),
  ...flattenPaletteObject({ ...basePalette.yellow }, 'yellow'),
  ...flattenPaletteObject({ ...basePalette.purple }, 'purple'),
  ...flattenPaletteObject({ ...basePalette.red }, 'red'),
};

/**
 * These are alpha variants of the semantic colors.
 * They exist separately from the semantic palette for
 * better maintainability.
 */
const alphaVariantsPalette: Palette = {
  primary_alpha8: hexToRgba(semanticPalette.primary40, 0.08),
  primary_alpha12: hexToRgba(semanticPalette.primary40, 0.12),
  primary_alpha16: hexToRgba(semanticPalette.primary40, 0.16),
  on_primary_alpha8: hexToRgba(semanticPalette.on_primary, 0.08),
  on_primary_alpha12: hexToRgba(semanticPalette.on_primary, 0.12),
  on_primary_container_alpha8: hexToRgba(semanticPalette.on_primary_container, 0.08),

  on_secondary_container_alpha8: hexToRgba(semanticPalette.on_secondary_container, 0.08),
  on_secondary_container_alpha12: hexToRgba(semanticPalette.on_secondary_container, 0.12),

  on_surface_alpha8: hexToRgba(semanticPalette.on_surface, 0.08),
  on_surface_alpha12: hexToRgba(semanticPalette.on_surface, 0.12),
  on_surface_alpha16: hexToRgba(semanticPalette.on_surface, 0.16),
  on_surface_alpha38: hexToRgba(semanticPalette.on_surface, 0.38),
  surface_variant_alpha8: hexToRgba(semanticPalette.surface_variant, 0.08),
  on_surface_variant_alpha8: hexToRgba(semanticPalette.on_surface_variant, 0.08),
  on_surface_variant_alpha12: hexToRgba(semanticPalette.on_surface_variant, 0.12),
  on_surface_variant_alpha16: hexToRgba(semanticPalette.on_surface_variant, 0.16),

  outline_alpha8: hexToRgba(semanticPalette.outline, 0.08),
  outline_alpha12: hexToRgba(semanticPalette.outline, 0.12),

  disabled: hexToRgba(semanticPalette.on_surface, 0.38),

  white_alpha8: hexToRgba(semanticPalette.white, 0.08),
  white_alpha12: hexToRgba(semanticPalette.white, 0.12),
  white_alpha50: hexToRgba(semanticPalette.white, 0.5),
  blue_alpha30: hexToRgba(semanticPalette.blue, 0.3),
  brown_alpha30: hexToRgba(semanticPalette.brown, 0.3),
  gray_alpha30: hexToRgba(semanticPalette.gray, 0.3),
  green_alpha30: hexToRgba(semanticPalette.green, 0.3),
  orange_alpha30: hexToRgba(semanticPalette.orange, 0.3),
  pink_alpha30: hexToRgba(semanticPalette.pink, 0.3),
  yellow_alpha30: hexToRgba(semanticPalette.yellow, 0.3),
  purple_alpha30: hexToRgba(semanticPalette.purple, 0.3),
  red_alpha8: hexToRgba(semanticPalette.red, 0.08),
  red_alpha30: hexToRgba(semanticPalette.red, 0.3),
};

/**
 * This contains all colors, their tonal variants,
 * semantic colors (on_container, container, etc), and alpha variants.
 */
export const palette: Palette = {
  ...semanticPalette,
  ...alphaVariantsPalette,
};

export const modalBackground = palette.surface;
