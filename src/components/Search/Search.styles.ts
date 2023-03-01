import { styled } from '@mui/system';
import { Box, OutlinedInput } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';

import { SearchProps } from './Search.types';

export const StyledTextField = styled(OutlinedInput)`
  height: ${({ height }: Pick<SearchProps, 'height' | 'width' | 'background'>) => height || '4rem'};
  width: ${({ width }) => width || '49.8rem'};
  background-color: ${({ background }) => background || variables.palette.surface1};
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
`;

export const StyledIcon = styled(Box)`
  display: flex;
  margin-right: ${theme.spacing(1)};

  svg {
    fill: ${variables.palette.outline};
  }
`;
