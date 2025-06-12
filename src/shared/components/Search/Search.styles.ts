import { Box, OutlinedInput, styled } from '@mui/material';

import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';

import { SearchProps } from './Search.types';

export const StyledTextField = styled(OutlinedInput)`
  height: ${({ height }: Pick<SearchProps, 'height' | 'width' | 'background'>) =>
    height || '4.8rem'};
  width: ${({ width }) => width || '49.8rem'};
  background-color: ${({ background }) => background || variables.palette.outline_alpha8};
  border-radius: 2.2rem;

  .MuiOutlinedInput-input {
    padding: 0;

    ::placeholder {
      color: ${variables.palette.outline};
      opacity: 1;
    }
  }

  .MuiOutlinedInput-notchedOutline {
    border: none;
  }

  &.Mui-focused {
    border: ${variables.borderWidth.md} solid ${variables.palette.on_surface_variant};
    padding-left: ${theme.spacing(1.3)};
    background-color: ${({ background }) => background || variables.palette.outline_alpha12};

    svg {
      fill: ${variables.palette.on_surface_variant};
    }
  }
`;

export const StyledIcon = styled(Box)`
  display: flex;
  margin-right: ${theme.spacing(0.8)};

  svg {
    fill: ${variables.palette.outline};
  }
`;
