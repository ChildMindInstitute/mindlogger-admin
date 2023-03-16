import { styled } from '@mui/material';

import { SelectController } from 'shared/components/FormComponents';
import { variables } from 'shared/styles';

export const StyledSelectController = styled(SelectController)`
  .MuiInputBase-root {
    font-size: ${variables.font.size.md};
    color: ${variables.palette.primary};

    ::before,
    ::after {
      border-bottom: none !important;
    }

    .MuiSelect-icon {
      top: unset;
      fill: ${variables.palette.primary};
    }
  }

  .MuiInputBase-root,
  .MuiInputBase-root .MuiSelect-select {
    background: none;
  }
`;
