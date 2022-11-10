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
  typography: {
    fontFamily: 'NotoSans',
    htmlFontSize: 16,
    button: {
      fontSize: variables.font.size.md,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: typography,
    },
    MuiButton: {
      variants: [
        {
          props: { variant: 'roundedContained' },
          style: {
            color: variables.palette.shades0,
            backgroundColor: variables.palette.primary50,
            borderRadius: variables.borderRadius.xl,

            '&:hover': {
              backgroundColor: variables.palette.primary60,
            },
            '&.Mui-disabled': {
              color: variables.palette.shades100_alfa50,
              backgroundColor: variables.palette.shades40,
            },
          },
        },
        {
          props: { variant: 'roundedOutlined' },
          style: {
            color: variables.palette.primary50,
            borderWidth: variables.borderWidth.md,
            borderStyle: 'solid',
            borderColor: variables.palette.shades80,
            borderRadius: variables.borderRadius.xl,

            '&:hover': {
              backgroundColor: variables.palette.primary95,
              borderColor: variables.palette.primary50,
            },
            '&.Mui-disabled': {
              color: variables.palette.shades100_alfa50,
              borderColor: variables.palette.shades40,
            },
          },
        },
      ],
      styleOverrides: {
        root: {
          fontWeight: variables.font.weight.semiBold,
          lineHeight: variables.lineHeight.md,
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
          paddingBottom: '0.625rem',
          paddingTop: '0.625rem',
          borderRadius: variables.borderRadius.sm,
          textTransform: 'none',
          height: 40,
          letterSpacing: variables.letterSpacing.sm,

          '&.MuiButton-contained': {
            '&:hover': {
              backgroundColor: variables.palette.primary60,
            },

            '&.Mui-disabled': {
              color: variables.palette.shades100_alfa50,
              backgroundColor: variables.palette.shades40,
            },
          },
          '&.MuiButton-outlined': {
            borderColor: variables.palette.primary50,

            '&:hover': {
              backgroundColor: variables.palette.primary95,
              borderWidth: variables.borderWidth.md,
            },

            '&.Mui-disabled': {
              color: variables.palette.shades100_alfa50,
              backgroundColor: 'transparent',
              borderWidth: variables.borderWidth.md,
              borderColor: variables.palette.shades40,
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
          color: variables.palette.shades100_alfa50,
          fontSize: variables.font.size.lg,

          '&.MuiFormLabel-filled': {
            color: variables.palette.shades100,
          },
          '&.Mui-focused': {
            color: variables.palette.primary50,
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
              borderColor: variables.palette.primary60,
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
          borderColor: variables.palette.shades40,
          color: variables.palette.shades100_alfa87,

          input: {
            padding: '1rem',
            fontSize: variables.font.size.lg,
          },

          '&:hover': {
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: variables.palette.primary60,
            },
          },

          '.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: variables.borderWidth.lg,
            borderColor: variables.palette.primary50,
          },
        },
      },
    },
  },
  palette: {
    primary: {
      main: variables.palette.primary50,
    },
    error: {
      main: variables.palette.semantic.error,
    },
  },
});

export default theme;
