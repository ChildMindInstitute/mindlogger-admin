import { SelectClasses, createTheme, Theme } from '@mui/material';
import { OverridesStyleRules } from '@mui/material/styles/overrides';
import 'react-datepicker/dist/react-datepicker.min.css';

import { Svg } from 'shared/components/Svg';
import { typography } from 'shared/styles/typography';
import { variables } from 'shared/styles/variables';
import { blendColorsNormal } from 'shared/utils/colors';
import { getChipStyleOverrides } from 'shared/styles/theme.utils';

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
    fontFamily: 'Atkinson',
    htmlFontSize: 10,
    button: {
      fontSize: variables.font.size.md,
    },
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
      }),
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: variables.borderRadius.lg2,
          boxShadow: 'none',
        },
        root: {
          '.MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.33)',
          },
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          '&.MuiTypography-root': {
            fontSize: variables.font.size.xxl,
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
            backgroundColor: variables.palette.primary_alfa12,
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
            fontSize: variables.font.size.md,
            lineHeight: variables.font.lineHeight.md,
            letterSpacing: variables.font.letterSpacing.lg,
          },
          '.MuiTableCell-body ~ .MuiTableCell-body': {
            borderLeft: `${variables.borderWidth.md} solid transparent}`,
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
          fontSize: variables.font.size.sm,
          lineHeight: variables.font.lineHeight.sm,
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
              fontSize: variables.font.size.md,
              lineHeight: variables.font.lineHeight.md,
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
      styleOverrides: {
        root: {
          lineHeight: variables.font.lineHeight.md,
          padding: '1rem 2rem',
          minWidth: '10rem',
          borderRadius: variables.borderRadius.xxxl,
          textTransform: 'none',
          height: '4.8rem',
          letterSpacing: variables.font.letterSpacing.sm,
          boxShadow: 'unset',
          '&.Mui-disabled': {
            '& svg': {
              fill: variables.palette.disabled,
            },
          },
          '&.MuiButton-contained': {
            fontWeight: variables.font.weight.bold,
            '& svg': {
              fill: variables.palette.white,
            },
            '&:hover': {
              backgroundColor: blendColorsNormal(
                variables.palette.primary,
                variables.palette.light_alfa8,
              ),
              boxShadow: 'unset',
            },
            ...Object.assign(
              {},
              ...['&:focus', '&:active', '&:visited'].map((item) => ({
                [item]: {
                  backgroundColor: variables.palette.contained_btn_focus,
                  boxShadow: 'unset',
                },
              })),
            ),
            '&.Mui-disabled': {
              color: variables.palette.disabled,
              backgroundColor: variables.palette.on_surface_alfa12,
              '& svg': {
                fill: variables.palette.disabled,
              },
            },
          },
          '&.MuiButton-outlined': {
            fontWeight: variables.font.weight.regular,
            borderColor: variables.palette.outline,
            '& svg': {
              fill: variables.palette.primary,
            },
            '&:hover': {
              backgroundColor: variables.palette.primary_alfa8,
            },
            '&.MuiButton-outlinedError': {
              '& svg': {
                fill: variables.palette.semantic.error,
              },
            },
            '&.Mui-disabled': {
              color: variables.palette.on_surface_alfa38,
              backgroundColor: 'transparent',
              borderColor: variables.palette.on_surface_alfa12,
              '& svg': {
                fill: variables.palette.disabled,
              },
            },
          },
          '&.MuiButton-text': {
            '&:hover': {
              backgroundColor: variables.palette.primary_alfa8,
            },
            '&.Mui-disabled': {
              color: variables.palette.on_surface_alfa38,
              backgroundColor: 'transparent',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          borderRadius: variables.borderRadius.md,
          fontSize: variables.font.size.md,
          fontWeight: variables.font.weight.regular,
          gap: '0.4rem',
          height: '2.4rem',
          lineHeight: variables.font.lineHeight.md,
          padding: '0.2rem 0.8rem',
          ...getChipStyleOverrides({ color: ownerState.color, variant: ownerState.variant }),

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
            fontSize: variables.font.size.md,
            fontWeight: variables.font.weight.regular,
            lineHeight: variables.font.lineHeight.md,
            borderRadius: variables.borderRadius.xxxl,
            borderColor: variables.palette.outline,
            textTransform: 'none',
            height: 40,
            padding: '1rem',
            '&:hover': {
              backgroundColor: variables.palette.on_secondary_container_alfa8,
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
                  variables.palette.on_secondary_container_alfa8,
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
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: variables.palette.on_surface_variant,
          fontSize: variables.font.size.lg,
          '&.Mui-focused': {
            color: variables.palette.primary,
          },
          '&.Mui-error': {
            color: variables.palette.semantic.error,
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          '&&': {
            height: 'auto',
            fontSize: variables.font.size.lg,
            lineHeight: variables.font.lineHeight.lg,
            padding: '1.6rem',
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: variables.font.size.md,
          lineHeight: variables.font.lineHeight.sm,
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
                borderColor: variables.palette.semantic.error,
              },
            },
          },
          '&.Mui-disabled': {
            '&&': {
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: variables.palette.on_surface_alfa12,
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
          color: variables.palette.black,
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
            '&.Mui-disabled': {
              pointerEvents: 'auto',
            },
            '&:hover': {
              backgroundColor: variables.palette.on_surface_variant_alfa8,
            },
          },
          '.MuiMenuItem-root.Mui-selected': {
            backgroundColor: variables.palette.on_surface_variant_alfa8,
            '&:focus': {
              backgroundColor: variables.palette.on_surface_variant_alfa8,
            },
            '&:hover': {
              backgroundColor: blendColorsNormal(
                variables.palette.on_surface_variant_alfa8,
                variables.palette.on_surface_alfa8,
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
              '&:hover': {
                backgroundColor: variables.palette.on_surface_variant_alfa8,
              },
              '&[aria-selected="true"]': {
                backgroundColor: variables.palette.on_surface_variant_alfa8,
                '&:hover': {
                  backgroundColor: blendColorsNormal(
                    variables.palette.on_surface_variant_alfa8,
                    variables.palette.on_surface_alfa8,
                  ),
                },
              },
            },
          },
        },
      },
    },
    MuiCheckbox: {
      defaultProps: {
        icon: <Svg height="20" id="checkbox-empty-outlined" width="20" />,
        checkedIcon: <Svg height="20" id="checkbox-filled" width="20" />,
      },
      styleOverrides: {
        root: ({ checked = false }) => ({
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
        root: ({ ownerState: { variant, severity } }) => ({
          fontSize: variables.font.size.lg,
          lineHeight: variables.font.lineHeight.lg,
          letterSpacing: variables.font.letterSpacing.md,
          color: variables.palette.on_surface,
          padding: theme.spacing(1.2, 1.6),
          borderRadius: 0,
          alignItems: 'center',
          ...(variant === 'standard' && {
            ...(severity === 'info' && {
              backgroundColor: variables.palette.blue_alfa30,
            }),
            ...(severity === 'success' && {
              backgroundColor: variables.palette.green_alfa30,
            }),
            ...(severity === 'warning' && {
              backgroundColor: variables.palette.yellow_alfa30,
            }),
            ...(severity === 'error' && {
              backgroundColor: variables.palette.error_container,
            }),
          }),
          '.MuiAlert-action': {
            marginRight: 0,
            paddingTop: 0,
            alignItems: 'center',
          },
          '.MuiAlert-icon': {
            marginLeft: 'auto',
          },
          '.MuiAlert-message': {
            padding: 0,
            maxWidth: theme.spacing(80),
          },
          '.MuiLink-root:hover': {
            textDecorationColor: 'transparent',
          },
          '.MuiButton-root': {
            padding: theme.spacing(1),
            margin: theme.spacing(0.4),
          },
          '.MuiButton-text:hover': {
            backgroundColor: variables.palette.on_surface_alfa8,
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
  },
  palette: {
    background: {
      default: variables.palette.surface,
    },
    primary: {
      main: variables.palette.primary,
    },
    info: {
      main: variables.palette.blue,
    },
    success: {
      main: variables.palette.green,
    },
    warning: {
      main: variables.palette.yellow,
    },
    error: {
      main: variables.palette.semantic.error,
    },
  },
});

export default theme;
