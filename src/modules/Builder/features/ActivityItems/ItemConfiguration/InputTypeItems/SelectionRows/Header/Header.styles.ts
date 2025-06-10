import { styled } from '@mui/material';

import { SelectController } from 'shared/components/FormComponents';
import { variables } from 'shared/styles';

export const StyledSelectController = styled(SelectController)`
  && {
    .MuiInputBase-root {
      font-size: ${variables.font.size.label1};
      color: ${variables.palette.primary};

      &::before,
      &::after {
        border-bottom: none;
      }

      &:hover {
        &::before,
        &::after {
          border-bottom: none;
        }
      }

      .MuiSelect-icon {
        fill: ${variables.palette.primary};
        width: 1.8rem;
        height: 1.8rem;
      }
    }
  }

  .MuiInputBase-root,
  .MuiInputBase-root .MuiSelect-select {
    background: none;
  }
`;
