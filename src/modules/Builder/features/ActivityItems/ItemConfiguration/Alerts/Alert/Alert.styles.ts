import { styled, Box } from '@mui/material';

import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';
import {
  StyledClearedButton,
  StyledFlexColumn,
  StyledFlexTopCenter,
} from 'shared/styles/styledComponents';

export const StyledAlert = styled(Box)`
  width: 100%;
  padding: ${theme.spacing(2, 2.4, 2.4)};
  background-color: ${variables.palette.surface1};
  border-radius: ${variables.borderRadius.lg2};
  margin-bottom: ${theme.spacing(2.4)};
`;

export const StyledRow = styled(StyledFlexTopCenter)`
  justify-content: space-between;
  margin-bottom: ${theme.spacing(2.4)};
`;

export const StyledDescription = styled(StyledFlexTopCenter)`
  margin-bottom: ${theme.spacing(1.6)};

  .MuiFormControl-root.MuiTextField-root {
    border-color: #72777f;
    border-radius: 8px;
    margin: ${theme.spacing(0, 0.5)};
  }

  .MuiOutlinedInput-input.MuiInputBase-input.MuiSelect-select {
    padding: 6px 14px;
    padding-right: 34px;
    font-size: 14px;
  }
`;

export const StyledRemoveBtn = styled(StyledClearedButton)`
  width: 4rem;
  height: 4rem;

  svg:hover {
    fill: ${variables.palette.primary};
  }
`;
