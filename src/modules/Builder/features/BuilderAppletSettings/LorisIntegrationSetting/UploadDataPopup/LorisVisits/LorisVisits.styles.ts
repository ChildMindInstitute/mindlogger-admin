import { Box, styled } from '@mui/material';

import { Table } from 'shared/components/Table';
import { SelectController } from 'shared/components/FormComponents';
import { theme, variables } from 'shared/styles';

export const StyledLorisVisits = styled(Box)`
  min-height: 14rem;
`;

export const StyledTable = styled(Table)`
  .visits-select {
    .MuiFormControl-root {
      width: 100%;
      max-width: 18rem;
    }

    .MuiSelect-select > :first-child {
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
    font-size: ${variables.font.size.md};
  }
`;

export const StyledSelectController = styled(SelectController)`
  min-width: 10rem;

  .MuiInputBase-root {
    border-radius: ${variables.borderRadius.md};
  }

  .MuiSelect-select {
    padding: ${theme.spacing(0.65, 1.2)};
    font-size: ${variables.font.size.md};
  }

  .MuiFormHelperText-root {
    display: none;
  }

  .MuiOutlinedInput-notchedOutline {
    border-color: ${variables.palette.outline};
  }
`;