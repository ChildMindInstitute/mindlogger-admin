import { createTheme } from '@mui/material/styles';

import { typography } from 'styles/typography';
import { variables } from 'styles/variables';

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
          fontSize: variables.font.size.xl,
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
          '.MuiTableCell-head': {
            borderLeft: 'none',
            color: variables.palette.on_surface_variant,
            fontWeight: variables.font.weight.medium,
          },
          '.MuiTableCell-body ~ .MuiTableCell-body': {
            borderLeftWidth: variables.borderWidth.md,
            borderLeftStyle: 'solid',
            borderLeftColor: 'transparent',
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

          '&.MuiButton-contained': {
            '&:hover': {
              backgroundColor: variables.palette.primary50,
              boxShadow: variables.boxShadow.light1,
            },

            '&:focus': {
              backgroundColor: variables.palette.primary50,
            },

            '&.Mui-disabled': {
              color: variables.palette.on_surface_variant,
              backgroundColor: variables.palette.surface_variant,
            },
          },
          '&.MuiButton-outlined': {
            borderColor: variables.palette.outline,

            '&:hover': {
              backgroundColor: variables.palette.surface1,
              borderWidth: variables.borderWidth.md,
            },

            '&:focus': {
              backgroundColor: variables.palette.surface1,
              borderColor: variables.palette.primary,
              borderWidth: variables.borderWidth.md,
            },

            '&.Mui-disabled': {
              color: variables.palette.outline,
              backgroundColor: 'transparent',
              borderWidth: variables.borderWidth.md,
              borderColor: variables.palette.outline_variant,
            },
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s',
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
