import { createTheme, SelectClasses, Theme } from '@mui/material';
import { OverridesStyleRules } from '@mui/material/styles/overrides';
import 'react-datepicker/dist/react-datepicker.min.css';

import { Svg } from 'shared/components/Svg';
import { getChipStyleOverrides } from 'shared/styles/theme.utils';
import { typography } from 'shared/styles/typography';
import { variables } from 'shared/styles/variables';
import { blendColorsNormal } from 'shared/utils/colors';

declare module '@mui/system/createTheme/createBreakpoints' {
  interface BreakpointOverrides {
    xxl: true;
  }
}

export const theme = createTheme({
  spacing: 10,
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1440,
      xxl: 1536,
    },
  },
  typography: {
    fontFamily: variables.font.family.body,
    htmlFontSize: 10,
    button: {
      fontSize: variables.font.size.body3,
    },
    displayLarge: {
      fontFamily: variables.font.family.display,
      fontWeight: variables.font.weight.light,
      fontSize: variables.font.size.display1,
      lineHeight: variables.font.lineHeight.display1,
      letterSpacing: variables.font.letterSpacing.none,
    },
    displayMedium: {
      fontFamily: variables.font.family.display,
      fontWeight: variables.font.weight.light,
      fontSize: variables.font.size.display2,
      lineHeight: variables.font.lineHeight.display2,
      letterSpacing: variables.font.letterSpacing.none,
    },
    displaySmall: {
      fontFamily: variables.font.family.display,
      fontWeight: variables.font.weight.light,
      fontSize: variables.font.size.display3,
      lineHeight: variables.font.lineHeight.display3,
      letterSpacing: variables.font.letterSpacing.none,
    },
    headlineLarge: {
      fontFamily: variables.font.family.headline,
      fontWeight: variables.font.weight.regular,
      fontSize: variables.font.size.headline1,
      lineHeight: variables.font.lineHeight.headline1,
      letterSpacing: variables.font.letterSpacing.none,
    },
    headlineMedium: {
      fontFamily: variables.font.family.headline,
      fontWeight: variables.font.weight.regular,
      fontSize: variables.font.size.headline2,
      lineHeight: variables.font.lineHeight.headline2,
      letterSpacing: variables.font.letterSpacing.none,
    },
    headlineSmall: {
      fontFamily: variables.font.family.headline,
      fontWeight: variables.font.weight.regular,
      fontSize: variables.font.size.headline3,
      lineHeight: variables.font.lineHeight.headline3,
      letterSpacing: variables.font.letterSpacing.none,
    },
    titleLarge: {
      fontFamily: variables.font.family.title,
      fontWeight: variables.font.weight.regular,
      fontSize: variables.font.size.title1,
      lineHeight: variables.font.lineHeight.title1,
      letterSpacing: variables.font.letterSpacing.none,
    },
    titleLargish: {
      fontFamily: variables.font.family.title,
      fontWeight: variables.font.weight.regular,
      fontSize: variables.font.size.title2,
      lineHeight: variables.font.lineHeight.title2,
      letterSpacing: variables.font.letterSpacing.none,
    },
    titleMedium: {
      fontFamily: variables.font.family.title,
      fontWeight: variables.font.weight.regular,
      fontSize: variables.font.size.title3,
      lineHeight: variables.font.lineHeight.title2,
      letterSpacing: variables.font.letterSpacing.md,
    },
    titleSmall: {
      fontFamily: variables.font.family.title,
      fontWeight: variables.font.weight.regular,
      fontSize: variables.font.size.title4,
      lineHeight: variables.font.lineHeight.title3,
      letterSpacing: variables.font.letterSpacing.sm,
    },
    labelLarge: {
      fontFamily: variables.font.family.label,
      fontWeight: variables.font.weight.regular,
      fontSize: variables.font.size.label1,
      lineHeight: variables.font.lineHeight.label1,
      letterSpacing: variables.font.letterSpacing.sm,
    },
    labelMedium: {
      fontFamily: variables.font.family.label,
      fontWeight: variables.font.weight.regular,
      fontSize: variables.font.size.label2,
      lineHeight: variables.font.lineHeight.label2,
      letterSpacing: variables.font.letterSpacing.xxl,
    },
    labelSmall: {
      fontFamily: variables.font.family.label,
      fontWeight: variables.font.weight.regular,
      fontSize: variables.font.size.label1,
      lineHeight: variables.font.lineHeight.label2,
      letterSpacing: variables.font.letterSpacing.xxl,
    },
    bodyLarger: {
      fontFamily: variables.font.family.body,
      fontWeight: variables.font.weight.regular,
      fontSize: variables.font.size.body1,
      lineHeight: variables.font.lineHeight.body1,
      letterSpacing: variables.font.letterSpacing.md,
    },
    bodyLarge: {
      fontFamily: variables.font.family.body,
      fontWeight: variables.font.weight.regular,
      fontSize: variables.font.size.body2,
      lineHeight: variables.font.lineHeight.body2,
      letterSpacing: variables.font.letterSpacing.md,
    },
    bodyMedium: {
      fontFamily: variables.font.family.body,
      fontWeight: variables.font.weight.regular,
      fontSize: variables.font.size.body3,
      lineHeight: variables.font.lineHeight.body3,
      letterSpacing: variables.font.letterSpacing.lg,
    },
    bodySmall: {
      fontFamily: variables.font.family.body,
      fontWeight: variables.font.weight.regular,
      fontSize: variables.font.size.body4,
      lineHeight: variables.font.lineHeight.body4,
      letterSpacing: variables.font.letterSpacing.xl,
    },

    // Standard MUI variants mapped to custom variants
    h1: { fontSize: variables.font.size.headline1 },
    h2: { fontSize: variables.font.size.headline2 },
    h3: { fontSize: variables.font.size.headline3 },
    h4: { fontSize: variables.font.size.title1 },
    h5: { fontSize: variables.font.size.title3 },
    h6: { fontSize: variables.font.size.title4 },
    subtitle1: { fontSize: variables.font.size.body2 },
    subtitle2: { fontSize: variables.font.size.body3 },
    body1: { fontSize: variables.font.size.body2 },
    body2: { fontSize: variables.font.size.body3 },
    caption: { fontSize: variables.font.size.body4 },
    overline: { fontSize: variables.font.size.label1 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: () => ({
        typography,
        html: {
          fontSize: '62.5%',
          height: '100%',
          overflowY: 'hidden',
        },
        body: {
          color: variables.palette.on_surface,
          height: '100vh',
          overflowY: 'hidden',
          '.highlighted-text': {
            backgroundColor: variables.palette.yellow,
            borderRadius: variables.borderRadius.xs,
          },
        },
        '.medium-zoom-image--opened, .medium-zoom-overlay': {
          visibility: 'hidden',
          zIndex: 0,
        },
        '.medium-zoom--opened .medium-zoom-overlay': {
          visibility: 'visible',
          zIndex: theme.zIndex.drawer,
        },
        '.medium-zoom--opened .medium-zoom-image--opened': {
          visibility: 'visible',
          zIndex: theme.zIndex.modal,
        },
        '*::-webkit-scrollbar': {
          width: '0.8rem',
          height: '0.8rem',
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: variables.palette.outline,
          borderRadius: variables.borderRadius.xxxl,
        },
        '.md-editor-dropdown': {
          zIndex: theme.zIndex.modal - 1,
        },
        '.md-editor-dropdown-hidden': {
          zIndex: -(theme.zIndex.modal - 1),
        },
      }),
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: variables.borderRadius.lg2,
          boxShadow: 'none',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          '&.MuiTypography-root': {
            fontSize: variables.font.size.headline2,
            lineHeight: variables.font.lineHeight.headline2,
            fontWeight: variables.font.weight.regular,
            padding: '6.4rem 3.2rem 2.8rem',
          },
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '3.2rem',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: variables.palette.primary_alpha12,
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderCollapse: 'unset',
          borderWidth: variables.borderWidth.md,
          borderStyle: 'solid',
          borderColor: variables.palette.surface_variant,
          borderRadius: variables.borderRadius.md,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:last-child .MuiTableCell-body': {
            borderBottom: `${variables.borderWidth.md} solid transparent`,
          },
          '.MuiTableCell-head': {
            borderLeft: 'none',
            color: variables.palette.outline,
            fontWeight: variables.font.weight.regular,
            fontSize: variables.font.size.title4,
            lineHeight: variables.font.lineHeight.title4,
            letterSpacing: variables.font.letterSpacing.sm,
          },
          '.MuiTableCell-body ~ .MuiTableCell-body': {
            borderLeft: 0,
          },
          '&.MuiTableRow-error': {
            position: 'relative',
            '.MuiTableCell-root:first-of-type::before': {
              content: '""',
              position: 'absolute',
              top: `-${variables.borderWidth.md2}`,
              left: 0,
              right: 0,
              bottom: 0,
              border: `${variables.borderWidth.md2} solid ${variables.palette.red}`,
            },
          },
          '&.MuiTableRow-has-hover': {
            cursor: 'pointer',
            transition: variables.transitions.bgColor,
            '&:hover': {
              backgroundColor: variables.palette.on_surface_variant_alpha8,
            },
          },
          '&.MuiTableRow-dragged-over': {
            position: 'relative',
            '.MuiTableCell-root:first-of-type::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              border: `${variables.borderWidth.lg} solid ${variables.palette.primary}`,
              borderRadius: variables.borderRadius.xs,
            },
          },
          '&.MuiTableRow-error:first-of-type .MuiTableCell-root:first-of-type::before': {
            top: 0,
          },
          '&.MuiTableRow-error:last-of-type .MuiTableCell-root:first-of-type::before': {
            borderBottomLeftRadius: variables.borderRadius.lg2,
            borderBottomRightRadius: variables.borderRadius.lg2,
          },
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          '.MuiTableRow-root:last-child': {
            '.MuiTableCell-body': {
              borderBottom: 'none',
            },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          minHeight: '4.8rem',
          padding: '0 1.2rem',
          fontSize: variables.font.size.body4,
          lineHeight: variables.font.lineHeight.body4,
          letterSpacing: variables.font.letterSpacing.xl,
          fontWeight: variables.font.weight.regular,
          color: variables.palette.on_surface,
          backgroundColor: 'transparent',
          borderBottomWidth: variables.borderWidth.md,
          borderBottomStyle: 'solid',
          borderBottomColor: variables.palette.surface_variant,
        },
        head: {
          fontWeight: variables.font.weight.regular,
          color: variables.palette.on_surface_variant,
          '.MuiTableSortLabel-root.Mui-active': {
            color: variables.palette.on_surface_variant,
          },
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        spacer: {
          flex: 'none',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          '&.MuiTablePagination-toolbar': {
            padding: 0,
            color: variables.palette.on_surface_variant,
            '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
              fontWeight: variables.font.weight.regular,
              fontSize: variables.font.size.body3,
              lineHeight: variables.font.lineHeight.body3,
              letterSpacing: variables.font.letterSpacing.lg,
            },
            '.MuiInputBase-root': {
              display: 'none',
            },
            '.MuiTablePagination-actions': {
              color: variables.palette.on_surface_variant,
              marginLeft: '1rem',
            },
          },
        },
      },
    },
    MuiButton: {
      defaultProps: { variant: 'textNeutral' },
      variants: [
        {
          props: { variant: 'contained' },
          style: {
            color: variables.palette.white,
            fontWeight: variables.font.weight.bold,

            '&.Mui-disabled': {
              backgroundColor: variables.palette.on_surface_alpha12,
              color: variables.palette.disabled,
            },

            '&:not(.Mui-disabled)': {
              '&:hover': {
                boxShadow: variables.boxShadow.buttonElevation1,
              },

              '&:active': {
                boxShadow: 'none',
              },

              '&:focus, &:active': {},
            },
          },
        },
        {
          props: { variant: 'outlined' },
          style: {
            background: variables.palette.white,
            border: `${variables.borderWidth.md} solid ${variables.palette.outline_variant}`,
            color: variables.palette.primary,
            fontWeight: variables.font.weight.regular,

            '&.Mui-disabled': {
              color: variables.palette.disabled,
              borderColor: variables.palette.on_surface_alpha12,
            },

            '&:not(.Mui-disabled)': {
              borderColor: variables.palette.outline_variant,

              '&:hover': {
                backgroundColor: variables.palette.primary_alpha8,
              },

              '&:focus, &:active': {
                backgroundColor: variables.palette.primary_alpha12,
              },
            },
          },
        },
        {
          props: { variant: 'text' },
          style: {
            background: 'transparent',
            fontWeight: variables.font.weight.regular,

            '&.Mui-disabled': {
              color: variables.palette.disabled,
            },

            '&:not(.MuiButton-textError):not(.Mui-disabled)': {
              color: variables.palette.primary,

              '&:hover': {
                backgroundColor: variables.palette.primary_alpha8,
              },

              '&:focus, &:active': {
                backgroundColor: variables.palette.primary_alpha12,
              },
            },

            '&:not(.Mui-disabled)': {
              '&:hover': {
                borderColor: variables.palette.outline,
              },

              '&:focus': {
                borderColor: 'currentColor',
              },
            },
          },
        },
        {
          props: { variant: 'elevated' },
          style: {
            background: variables.palette.surface1,
            color: variables.palette.primary,
            fontWeight: variables.font.weight.bold,
            boxShadow: variables.boxShadow.buttonElevation1,

            '&.Mui-disabled': {
              backgroundColor: variables.palette.on_surface_alpha12,
              color: variables.palette.disabled,
            },

            '&:not(.Mui-disabled)': {
              '&:hover': {
                backgroundColor: variables.palette.surface2,
                boxShadow: variables.boxShadow.buttonElevation2,
              },

              '&:focus, &:active': {
                backgroundColor: blendColorsNormal(
                  variables.palette.surface1,
                  variables.palette.white_alpha12,
                ),
                boxShadow: variables.boxShadow.buttonElevation1,
              },
            },
          },
        },
        {
          props: { variant: 'tonal' },
          style: {
            background: variables.palette.secondary_container,
            color: variables.palette.on_secondary_container,
            fontWeight: variables.font.weight.regular,

            '&.Mui-disabled': {
              backgroundColor: variables.palette.on_surface_alpha12,
              color: variables.palette.disabled,
            },

            '&:not(.Mui-disabled)': {
              '&:hover': {
                backgroundColor: blendColorsNormal(
                  variables.palette.secondary_container,
                  variables.palette.on_secondary_container_alpha8,
                ),
                boxShadow: variables.boxShadow.buttonElevation1,
              },

              '&:active': {
                boxShadow: 'none',
              },

              '&:focus, &:active': {
                backgroundColor: blendColorsNormal(
                  variables.palette.secondary_container,
                  variables.palette.on_secondary_container_alpha12,
                ),
              },
            },
          },
        },
        {
          props: { variant: 'textNeutral' },
          style: {
            background: 'transparent',
            color: variables.palette.on_surface_variant,
            fontWeight: variables.font.weight.regular,

            '&.Mui-disabled': {
              color: variables.palette.disabled,
            },

            '&:not(.Mui-disabled)': {
              '&:hover': {
                backgroundColor: variables.palette.on_surface_variant_alpha8,
              },

              '&:focus, &:active': {
                backgroundColor: variables.palette.on_surface_variant_alpha12,
              },
            },
          },
        },
      ],
      styleOverrides: {
        root: {
          border: 'none',
          borderRadius: variables.borderRadius.xxxl,
          boxShadow: 'none',
          fontSize: variables.font.size.body3,
          lineHeight: variables.font.lineHeight.body3,
          letterSpacing: variables.font.letterSpacing.lg,
          height: '4.8rem',
          minWidth: '10rem',
          padding: '1rem 2rem',
          textTransform: 'none',
          gap: '0.8rem',

          '& svg:not([fill])': {
            fill: 'currentColor',
          },
        },
      },
    },
    MuiChip: {
      defaultProps: { size: 'small' },
      styleOverrides: {
        root: ({ ownerState: { color, variant, size } }) => ({
          borderRadius: variables.borderRadius.md,
          fontSize: variables.font.size[size === 'small' ? 'body3' : 'body2'],
          lineHeight: variables.font.lineHeight[size === 'small' ? 'body3' : 'body2'],
          letterSpacing: variables.font.letterSpacing[size === 'small' ? 'lg' : 'md'],
          fontWeight: variables.font.weight.regular,
          gap: '0.4rem',
          height: size === 'small' ? '2.4rem' : '3.2rem',
          padding: size === 'small' ? '0.2rem 0.8rem' : '0.4rem 0.8rem',
          ...getChipStyleOverrides({ color, variant }),

          '.MuiChip-deleteIcon': { margin: 0 },
          '.MuiChip-icon': { fill: 'currentColor', margin: 0 },
          '.MuiChip-label': { padding: 0 },
        }),
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          '.MuiToggleButton-root': {
            color: variables.palette.on_secondary_container,
            fontSize: variables.font.size.body3,
            lineHeight: variables.font.lineHeight.body3,
            letterSpacing: variables.font.letterSpacing.lg,
            fontWeight: variables.font.weight.regular,
            borderRadius: variables.borderRadius.xxxl,
            borderColor: variables.palette.outline,
            textTransform: 'none',
            height: 40,
            padding: '1rem',
            '&:hover': {
              backgroundColor: variables.palette.on_secondary_container_alpha8,
            },
            '&.MuiToggleButtonGroup-grouped:not(:first-of-type)': {
              borderLeftColor: variables.palette.outline,
            },
            '&.Mui-selected': {
              backgroundColor: variables.palette.secondary_container,
              color: variables.palette.on_secondary_container,
              '&:hover': {
                backgroundColor: blendColorsNormal(
                  variables.palette.secondary_container,
                  variables.palette.on_secondary_container_alpha8,
                ),
              },
            },
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          transition: variables.transitions.all,
          color: variables.palette.secondary,
          textDecorationColor: variables.palette.secondary,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: variables.palette.on_surface_variant,
          fontSize: variables.font.size.title3,
          lineHeight: variables.font.lineHeight.title3,
          letterSpacing: variables.font.letterSpacing.md,
          '&.Mui-focused': {
            color: variables.palette.primary,
          },
          '&.Mui-error': {
            color: variables.palette.error,
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          '&&': {
            height: 'auto',
            fontSize: variables.font.size.title3,
            lineHeight: variables.font.lineHeight.title3,
            letterSpacing: variables.font.letterSpacing.md,
            padding: '1.6rem',
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: variables.font.size.title4,
          lineHeight: variables.font.lineHeight.title4,
          letterSpacing: variables.font.letterSpacing.md,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: variables.borderRadius.sm,
          '.MuiOutlinedInput-notchedOutline': {
            borderColor: variables.palette.outline_variant,
          },
          '&:hover': {
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: variables.palette.primary50,
            },
            '&.Mui-error': {
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: variables.palette.error,
              },
            },
          },
          '&.Mui-disabled': {
            '&&': {
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: variables.palette.on_surface_alpha12,
              },
            },
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          '&:not(.Mui-disabled) .MuiSvgIcon-root': {
            color: variables.palette.primary,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: variables.borderRadius.xs,
          padding: 0,
          borderWidth: variables.borderWidth.md,
          borderColor: variables.palette.outline_variant,
          color: variables.palette.on_surface,
          '&:hover': {
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: variables.palette.primary50,
            },
          },
          '.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: variables.borderWidth.lg,
            borderColor: variables.palette.primary,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: variables.borderRadius.xs,
          borderColor: variables.palette.outline_variant,
          color: variables.palette.on_surface,
          '&:hover': {
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: variables.palette.primary50,
            },
          },
          '.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: variables.borderWidth.lg,
            borderColor: variables.palette.primary,
          },
          svg: {
            fill: variables.palette.on_surface_variant,
          },
        },
        select: {
          '&&': {
            maxWidth: '87%',
            paddingRight: '3rem',
          },
        },
      } as Partial<
        OverridesStyleRules<keyof SelectClasses, 'MuiSelect', Omit<Theme, 'shared/components'>>
      >,
    },
    MuiMenu: {
      styleOverrides: {
        root: {
          '.MuiPaper-root': {
            backgroundColor: variables.palette.surface,
            borderRadius: variables.borderRadius.md,
            border: `${variables.borderWidth.md} solid ${variables.palette.surface_variant}`,
            boxShadow: variables.boxShadow.soft,
            marginTop: '0.4rem',
            padding: '0.8rem 0',
          },
          '.MuiList-root': {
            padding: '0',
          },
          '.MuiMenuItem-root': {
            padding: '1.2rem 2rem',
            transition: variables.transitions.bgColor,
            // Enable hover events (for tooltips) without enabling click events
            '&.Mui-disabled:not(:active)': {
              pointerEvents: 'auto',
            },
            '&:hover': {
              backgroundColor: variables.palette.on_surface_variant_alpha8,
            },
          },
          '.MuiMenuItem-root.Mui-selected': {
            backgroundColor: variables.palette.on_surface_variant_alpha8,
            '&:focus': {
              backgroundColor: variables.palette.on_surface_variant_alpha8,
            },
            '&:hover': {
              backgroundColor: blendColorsNormal(
                variables.palette.on_surface_variant_alpha8,
                variables.palette.on_surface_alpha8,
              ),
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          '&.MuiAutocomplete-paper': {
            backgroundColor: variables.palette.surface,
            borderRadius: variables.borderRadius.md,
            border: `${variables.borderWidth.md} solid ${variables.palette.surface_variant}`,
            boxShadow: variables.boxShadow.soft,
            marginTop: '0.4rem',
            padding: '0',
            '.MuiAutocomplete-option': {
              transition: variables.transitions.bgColor,
              padding: '0.5rem 1.6rem',
              minHeight: '4.8rem',
              '&:hover': {
                backgroundColor: variables.palette.on_surface_variant_alpha8,
              },
              '&[aria-selected="true"]': {
                backgroundColor: variables.palette.on_surface_variant_alpha8,
                '&:hover': {
                  backgroundColor: blendColorsNormal(
                    variables.palette.on_surface_variant_alpha8,
                    variables.palette.on_surface_alpha8,
                  ),
                },
              },
            },
            '.MuiFormControlLabel-root': {
              marginLeft: '-1.2rem',
            },
            '.MuiCheckbox-root': {
              marginLeft: '-0.4rem',
            },
            '.MuiAutocomplete-listbox': {
              maxHeight: '20.8rem', // 4 rows
            },
          },
        },
      },
    },
    MuiCheckbox: {
      defaultProps: {
        icon: <Svg id="checkbox-empty-outlined" width={24} height={24} />,
        checkedIcon: <Svg id="checkbox-filled" width={24} height={24} />,
      },
      styleOverrides: {
        root: ({ checked = false }) => ({
          padding: theme.spacing(0.7),
          marginRight: theme.spacing(0.8),
          fill: checked ? variables.palette.primary : variables.palette.outline_variant2,
        }),
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: '6.4rem',
          alignItems: 'center',
          '.MuiButtonBase-root': {
            left: '0.6rem',
            top: '0.1rem',
            '.MuiSwitch-thumb': {
              color: variables.palette.white,
              width: '1.8rem',
              height: '1.8rem',
            },
            '&.Mui-checked': {
              transform: 'translateX(1.6rem)',
              '.MuiSwitch-thumb': {
                color: variables.palette.white,
              },
              '+ .MuiSwitch-track': {
                backgroundColor: variables.palette.primary,
                opacity: 1,
              },
            },
          },
          '.MuiSwitch-track': {
            width: '4rem',
            height: '2.4rem',
            borderRadius: variables.borderRadius.xxxl,
            backgroundColor: variables.palette.outline,
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: ({ ownerState: { variant, severity, color } }) => ({
          fontSize: variables.font.size.title3,
          lineHeight: variables.font.lineHeight.title3,
          letterSpacing: variables.font.letterSpacing.md,
          color: variables.palette.on_surface,
          padding: theme.spacing(1.2, 1.6),
          borderRadius: 0,
          alignItems: 'center',
          ...(variant === 'standard' && {
            ...(severity === 'info' && {
              backgroundColor: variables.palette.blue_alpha30,
            }),
            ...(severity === 'success' && {
              backgroundColor: variables.palette.green_alpha30,
            }),
            ...(severity === 'warning' && {
              backgroundColor: variables.palette.yellow_alpha30,
            }),
            ...(severity === 'error' && {
              backgroundColor: variables.palette.error_container,
            }),
            ...(color === 'infoAlt' && {
              backgroundColor: variables.palette.purple_alpha30,
            }),
          }),
          '.MuiAlert-action': {
            marginLeft: 0,
            marginRight: 0,
            paddingTop: 0,
            alignItems: 'center',
          },
          '.MuiAlert-icon': {
            marginLeft: 'auto',
            opacity: 1,
          },
          '.MuiAlert-message': {
            padding: 0,
            maxWidth: theme.spacing(80),
            marginRight: 'auto',
          },
          '.MuiLink-root:hover': {
            textDecorationColor: 'transparent',
          },
          '.MuiButton-root': {
            padding: theme.spacing(1),
            margin: theme.spacing(0.4),
          },
          '.MuiButton-text:hover': {
            backgroundColor: variables.palette.on_surface_alpha8,
          },
        }),
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: variables.palette.surface_variant,
          height: variables.borderWidth.md,
          border: 0,
          margin: 0,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        root: {
          '.MuiDrawer-paper': {
            maxWidth: '100%',
            backgroundColor: variables.palette.surface,
          },
          '.MuiModal-backdrop': {
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
          },
        },
      },
    },
    MuiListItemSecondaryAction: {
      styleOverrides: {
        root: {
          display: 'flex',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: ({ ownerState: { color }, theme }) => ({
          ...(color === 'outlined' && {
            borderWidth: variables.borderWidth.md,
            borderStyle: 'solid',
            borderColor: variables.palette.outline_variant,
          }),
          '&.MuiAutocomplete-popupIndicator': {
            padding: theme.spacing(0.8),
            margin: theme.spacing(-0.6, -0.4, -0.6, 0.6),
            color: variables.palette.on_surface_variant,
          },
          '&.MuiAutocomplete-clearIndicator': {
            padding: theme.spacing(1),
            margin: theme.spacing(-0.6, 0),
            color: variables.palette.on_surface_variant,
          },
        }),
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: ({ theme, ownerState: { size } }) => ({
          '&&': {
            '.MuiAutocomplete-inputRoot': {
              padding: theme.spacing(size === 'large' ? 1.2 : 0.9),
              paddingLeft: theme.spacing(size === 'large' ? 2.7 : 1.2),
            },
            '&.MuiAutocomplete-hasClearIcon .MuiAutocomplete-inputRoot': {
              paddingRight: theme.spacing(size === 'large' ? 8.8 : 5.6),
            },
            '&.MuiAutocomplete-hasPopupIcon .MuiAutocomplete-inputRoot': {
              paddingRight: theme.spacing(size === 'large' ? 8.8 : 5.6),
            },
            '&.MuiAutocomplete-hasPopupIcon.MuiAutocomplete-hasClearIcon .MuiAutocomplete-inputRoot':
              {
                paddingRight: theme.spacing(size === 'large' ? 13.6 : 10.4),
              },
            '.MuiAutocomplete-endAdornment': {
              right: theme.spacing(size === 'large' ? 1.6 : 0.9),
            },
          },
        }),
      },
    },
  },
  palette: {
    background: {
      default: variables.palette.surface,
    },
    primary: {
      main: variables.palette.primary,
      dark: blendColorsNormal(variables.palette.primary, variables.palette.white_alpha8),
      light: blendColorsNormal(variables.palette.primary, variables.palette.white_alpha12),
    },
    info: {
      main: variables.palette.blue,
    },
    infoAlt: {
      main: variables.palette.purple,
      dark: blendColorsNormal(variables.palette.purple, variables.palette.white_alpha8),
      light: blendColorsNormal(variables.palette.purple, variables.palette.white_alpha12),
      contrastText: variables.palette.on_secondary_container,
    },
    success: {
      main: variables.palette.green,
    },
    warning: {
      main: variables.palette.yellow,
    },
    error: {
      main: variables.palette.red,
      dark: blendColorsNormal(variables.palette.red, variables.palette.white_alpha8),
      light: blendColorsNormal(variables.palette.red, variables.palette.white_alpha12),
    },
  },
});

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    elevated: true;
    tonal: true;
    textNeutral: true;
  }
}

declare module '@mui/material/IconButton' {
  interface IconButtonPropsColorOverrides {
    outlined: true;
  }
}

declare module '@mui/material/Autocomplete' {
  interface AutocompletePropsSizeOverrides {
    large: true;
  }
}

declare module '@mui/material/styles' {
  interface Palette {
    infoAlt: Palette['primary'];
  }
  interface PaletteOptions {
    infoAlt?: PaletteOptions['primary'];
  }
}

declare module '@mui/material/Alert' {
  interface AlertPropsColorOverrides {
    infoAlt: true;
  }
}

declare module '@mui/material/Chip' {
  interface ChipPropsColorOverrides {
    infoAlt: true;
  }
}

declare module '@mui/material/styles' {
  interface TypographyVariants {
    // Display variants - Affix Light
    displayLarge: React.CSSProperties;
    displayMedium: React.CSSProperties;
    displaySmall: React.CSSProperties;

    // Headline variants - Moderat Regular
    headlineLarge: React.CSSProperties;
    headlineMedium: React.CSSProperties;
    headlineSmall: React.CSSProperties;

    // Title variants - Moderat Regular & Bold
    titleLarge: React.CSSProperties;
    titleLargeBold: React.CSSProperties;
    titleLargish: React.CSSProperties;
    titleLargishBold: React.CSSProperties;
    titleMedium: React.CSSProperties;
    titleMediumBold: React.CSSProperties;
    titleSmall: React.CSSProperties;
    titleSmallBold: React.CSSProperties;

    // Label variants - Moderat Regular & Bold
    labelLarge: React.CSSProperties;
    labelLargeBold: React.CSSProperties;
    labelMedium: React.CSSProperties;
    labelMediumBold: React.CSSProperties;
    labelSmall: React.CSSProperties;
    labelSmallBold: React.CSSProperties;

    // Body variants - Moderat Regular
    bodyLarger: React.CSSProperties;
    bodyLarge: React.CSSProperties;
    bodyMedium: React.CSSProperties;
    bodySmall: React.CSSProperties;
  }

  // Allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    // Display variants - Affix Light
    displayLarge?: React.CSSProperties;
    displayMedium?: React.CSSProperties;
    displaySmall?: React.CSSProperties;

    // Headline variants - Moderat Regular
    headlineLarge?: React.CSSProperties;
    headlineMedium?: React.CSSProperties;
    headlineSmall?: React.CSSProperties;

    // Title variants - Moderat Regular & Bold
    titleLarge?: React.CSSProperties;
    titleLargeBold?: React.CSSProperties;
    titleLargish?: React.CSSProperties;
    titleLargishBold?: React.CSSProperties;
    titleMedium?: React.CSSProperties;
    titleMediumBold?: React.CSSProperties;
    titleSmall?: React.CSSProperties;
    titleSmallBold?: React.CSSProperties;

    // Label variants - Moderat Regular & Bold
    labelLarge?: React.CSSProperties;
    labelLargeBold?: React.CSSProperties;
    labelMedium?: React.CSSProperties;
    labelMediumBold?: React.CSSProperties;
    labelSmall?: React.CSSProperties;
    labelSmallBold?: React.CSSProperties;

    // Body variants - Moderat Regular
    bodyLarger?: React.CSSProperties;
    bodyLarge?: React.CSSProperties;
    bodyMedium?: React.CSSProperties;
    bodySmall?: React.CSSProperties;
  }
}

// Update the Typography component props
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    // Display variants - Affix Light
    displayLarge: true;
    displayMedium: true;
    displaySmall: true;

    // Headline variants - Moderat Regular
    headlineLarge: true;
    headlineMedium: true;
    headlineSmall: true;

    // Title variants - Moderat Regular & Bold
    titleLarge: true;
    titleLargeBold: true;
    titleLargish: true;
    titleLargishBold: true;
    titleMedium: true;
    titleMediumBold: true;
    titleSmall: true;
    titleSmallBold: true;

    // Label variants - Moderat Regular & Bold
    labelLarge: true;
    labelLargeBold: true;
    labelMedium: true;
    labelMediumBold: true;
    labelSmall: true;
    labelSmallBold: true;

    // Body variants - Moderat Regular
    bodyLarger: true;
    bodyLarge: true;
    bodyMedium: true;
    bodySmall: true;
  }
}

export default theme;
