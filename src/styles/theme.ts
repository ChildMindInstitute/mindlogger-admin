import { createTheme } from '@mui/material/styles';
import 'react-datepicker/dist/react-datepicker.min.css';

import { typography } from 'styles/typography';
import { variables } from 'styles/variables';

const commonFocusStyles = Object.assign(
  {},
  ...['&:focus', '&:active', '&:visited'].map((item) => ({
    [item]: {
      backgroundColor: variables.palette.primary_alfa12,
    },
  })),
);

const theme = createTheme({
  spacing: 10,
  typography: {
    fontFamily: 'NotoSans',
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
        },
        '*::-webkit-scrollbar': {
          width: '0.8rem',
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: variables.palette.outline,
          borderRadius: variables.borderRadius.xxl,
        },
      }),
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 28,
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
          fontSize: variables.font.size.xxl,
          fontWeight: variables.font.weight.medium,
          padding: '6.4rem 2.4rem 2.8rem',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '2.4rem',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: variables.palette.secondary_container,
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
            color: variables.palette.on_surface_variant,
            fontWeight: variables.font.weight.medium,
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
          '.MuiTableRow-root:hover': {
            backgroundColor: variables.palette.surface1,
            cursor: 'pointer',
          },
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
          height: '4.8rem',
          padding: '0 1.2rem',
          fontSize: variables.font.size.sm,
          lineHeight: variables.lineHeight.sm,
          fontWeight: variables.font.weight.medium,
          color: variables.palette.on_surface,
          borderBottomWidth: variables.borderWidth.md,
          borderBottomStyle: 'solid',
          borderBottomColor: variables.palette.surface_variant,
        },
        head: {
          fontWeight: variables.font.weight.semiBold,
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
              lineHeight: variables.lineHeight.md,
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
          fontWeight: variables.font.weight.medium,
          lineHeight: variables.lineHeight.md,
          padding: '1rem 1.6rem',
          borderRadius: variables.borderRadius.xxl,
          textTransform: 'none',
          height: 40,
          letterSpacing: variables.letterSpacing.sm,
          boxShadow: 'unset',
          '&.MuiButton-contained': {
            '&:hover': {
              backgroundColor: variables.palette.contained_btn_hover,
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
              color: variables.palette.contained_btn_disabled_text,
              backgroundColor: variables.palette.on_surface_alfa12,
            },
          },
          '&.MuiButton-outlined': {
            borderColor: variables.palette.outline,
            '&:hover': {
              backgroundColor: variables.palette.primary_alfa8,
            },
            ...commonFocusStyles,
            '&.Mui-disabled': {
              color: variables.palette.on_surface_alfa38,
              backgroundColor: 'transparent',
              borderColor: variables.palette.on_surface_alfa12,
            },
          },
          '&.MuiButton-text': {
            '&:hover': {
              backgroundColor: variables.palette.primary_alfa8,
            },
            ...commonFocusStyles,
            '&.Mui-disabled': {
              color: variables.palette.on_surface_alfa38,
              backgroundColor: 'transparent',
            },
          },
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          '.MuiToggleButton-root': {
            color: variables.palette.on_secondary_container,
            fontSize: variables.font.size.md,
            fontWeight: variables.font.weight.medium,
            lineHeight: variables.lineHeight.md,
            borderRadius: variables.borderRadius.xxl,
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
          color: variables.palette.outline,
          fontSize: variables.font.size.lg,
          '&.MuiFormLabel-filled': {
            color: variables.palette.black,
          },
          '&.Mui-focused': {
            color: variables.palette.primary,
          },
          '&.Mui-error': {
            color: variables.palette.semantic.error,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: variables.borderRadius.sm,
          '&:hover': {
            '&.Mui-error': {
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: variables.palette.semantic.error,
              },
            },
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: variables.palette.primary50,
            },
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

          input: {
            padding: '1.6rem',
            fontSize: variables.font.size.lg,
          },
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
    MuiMenu: {
      styleOverrides: {
        root: {
          '.MuiPaper-root': {
            backgroundColor: variables.palette.surface2,
            borderRadius: variables.borderRadius.lg,
            boxShadow: variables.boxShadow.light2,
            marginTop: '0.4rem',
            padding: '0 0.4rem',
          },
          '.MuiMenuItem-root': {
            borderRadius: variables.borderRadius.xxs,
            '&:hover': {
              backgroundColor: variables.palette.secondary_container,
            },
          },
          '.MuiMenuItem-root.Mui-selected': {
            backgroundColor: variables.palette.surface_variant,
          },
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
    error: {
      main: variables.palette.semantic.error,
    },
  },
});
export default theme;
