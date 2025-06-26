import { styled } from '@mui/material';

import { SelectController } from 'shared/components/FormComponents';
import { Table } from 'shared/components/Table';
import { theme, variables } from 'shared/styles';

export const StyledTable = styled(Table)`
  tbody {
    .MuiFormControlLabel-root {
      margin: 0;
    }
  }

  .MuiFormControl-root {
    width: 18rem;
  }

  .MuiSelect-select.MuiSelect-outlined.MuiInputBase-input.MuiOutlinedInput-input {
    padding: ${theme.spacing(0.65, 1.2)};
    font-size: ${variables.font.size.label1};

    > :first-of-type {
      display: block;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }

  .controller-placeholder {
    top: 0;
    left: 0;
    padding: ${theme.spacing(0.65, 1.2)};
    font-size: ${variables.font.size.label1};
  }
`;

export const StyledSelectController = styled(SelectController)`
  min-width: 10rem;

  .MuiInputBase-root {
    border-radius: ${variables.borderRadius.md};

    &.Mui-error {
      .MuiOutlinedInput-notchedOutline {
        background-color: ${variables.palette.red_alpha8};
      }
    }
  }

  .MuiSelect-select {
    padding: ${theme.spacing(0.65, 1.2)};
    font-size: ${variables.font.size.label1};
  }

  .MuiFormHelperText-root {
    display: none;
  }

  .MuiOutlinedInput-notchedOutline {
    border-color: ${variables.palette.outline};
  }
`;
