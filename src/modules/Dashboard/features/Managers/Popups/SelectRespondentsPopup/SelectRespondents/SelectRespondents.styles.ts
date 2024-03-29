import { styled } from '@mui/material';

import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';
import { StyledFlexTopCenter } from 'shared/styles/styledComponents';

export const StyledFilterContainer = styled(StyledFlexTopCenter)`
  justify-content: space-between;
  margin: ${theme.spacing(2.4, 0)};

  .MuiInputBase-root.MuiOutlinedInput-root {
    background-color: ${variables.palette.outline_alfa8};
  }
`;

export const StyledSelectContainer = styled(StyledFlexTopCenter)`
  flex-shrink: 0;
  justify-content: end;
`;
