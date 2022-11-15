import { createTheme } from '@mui/material/styles';

import { typography } from 'styles/typography';
import { variables } from 'styles/variables';

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    roundedOutlined: true;
    roundedContained: true;
  }
}

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
      }),
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          background: 'rgba(0, 0, 0, 0.33)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 28,
          boxShadow: 'none',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: variables.font.size.xl,
          fontWeight: variables.font.weight.medium,
          padding: '3.6rem 2.4rem',
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
            backgroundColor: variables.palette.surface1,
          },
        },
      },
    },
    MuiButton: {
      variants: [
        {
          props: { variant: 'roundedContained' },
          style: {
            color: variables.palette.white,
            backgroundColor: variables.palette.primary,
            borderRadius: variables.borderRadius.xxl,

            '&:hover': {
              backgroundColor: variables.palette.primary50,
            },
            '&.Mui-disabled': {
              color: variables.palette.outline,
              backgroundColor: variables.palette.outline_variant,
            },
          },
        },
        {
          props: { variant: 'roundedOutlined' },
          style: {
            color: variables.palette.primary,
            borderWidth: variables.borderWidth.md,
            borderStyle: 'solid',
            borderColor: variables.palette.on_surface_variant,
            borderRadius: variables.borderRadius.xxl,

            '&:hover': {
              backgroundColor: variables.palette.surface1,
              borderColor: variables.palette.primary,
            },
            '&.Mui-disabled': {
              color: variables.palette.outline,
              borderColor: variables.palette.outline_variant,
            },
          },
        },
      ],
      styleOverrides: {
        root: {
          fontWeight: variables.font.weight.semiBold,
          lineHeight: variables.lineHeight.md,
          padding: '1rem 2.4rem',
          borderRadius: variables.borderRadius.sm,
          textTransform: 'none',
          height: 40,
          letterSpacing: variables.letterSpacing.sm,

          '&.MuiButton-contained': {
            '&:hover': {
              backgroundColor: variables.palette.primary50,
            },

            '&.Mui-disabled': {
              color: variables.palette.outline,
              backgroundColor: variables.palette.outline_variant,
            },
          },
          '&.MuiButton-outlined': {
            borderColor: variables.palette.primary,

            '&:hover': {
              backgroundColor: variables.palette.surface1,
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
