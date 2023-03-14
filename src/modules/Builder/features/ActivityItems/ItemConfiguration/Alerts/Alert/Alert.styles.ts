import { styled, Box } from '@mui/material';

import { theme, variables, StyledClearedButton, StyledFlexTopCenter } from 'shared/styles';

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
    border-color: ${variables.palette.outline};
    border-radius: ${variables.borderRadius.md};
    margin: ${theme.spacing(0, 0.5)};
  }

  .MuiOutlinedInput-input.MuiInputBase-input.MuiSelect-select {
    padding: ${theme.spacing(0.6, 1.4)};
    padding-right: ${theme.spacing(3.4)};
    font-size: ${variables.font.size.md};
  }
`;

export const StyledRemoveBtn = styled(StyledClearedButton)`
  width: 4rem;
  height: 4rem;

  svg:hover {
    fill: ${variables.palette.primary};
  }
`;
