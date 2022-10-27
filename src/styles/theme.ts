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
      fontSize: '0.875rem',
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
            borderRadius: 100,

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
            borderWidth: '0.0625rem',
            borderStyle: 'solid',
            borderColor: variables.palette.shades80,
            borderRadius: 100,

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
          fontWeight: 600,
          lineHeight: 1.25,
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
          paddingBottom: '0.625rem',
          paddingTop: '0.625rem',
          borderRadius: 5,
          textTransform: 'none',
          height: 40,

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
            '&:hover': {
              backgroundColor: variables.palette.primary95,
              borderWidth: '0.0625rem',
              borderColor: variables.palette.primary50,
            },

            '&.Mui-disabled': {
              color: variables.palette.shades100_alfa50,
              backgroundColor: 'transparent',
              borderWidth: '0.0625rem',
              borderColor: variables.palette.shades40,
            },
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: variables.palette.shades100_alfa50,
          fontSize: '1rem',

          '&.MuiFormLabel-filled': {
            color: variables.palette.shades100,
          },
          '&.Mui-focused': {
            color: variables.palette.primary50,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&:hover': {
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
          borderRadius: 4,
          padding: 0,
          borderColor: variables.palette.shades40,
          color: variables.palette.shades100_alfa87,

          input: {
            paddingLeft: '1rem',
            paddingRight: '1rem',
            paddingBottom: '1rem',
            paddingTop: '1rem',
            fontSize: '1rem',
          },

          '&:hover': {
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: variables.palette.primary60,
            },
          },

          '.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: '0.0625rem',
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
