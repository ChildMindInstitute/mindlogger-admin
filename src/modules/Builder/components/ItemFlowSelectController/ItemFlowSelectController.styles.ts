import { styled } from '@mui/material';

import { SelectController } from 'shared/components/FormComponents';
import { theme, variables } from 'shared/styles';

export const StyledSelectController = styled(SelectController)({
  minWidth: theme.spacing(10),
  width: '100%',

  '&& .MuiInputBase-root': {
    borderRadius: variables.borderRadius.md,

    '&.Mui-error': {
      background: variables.palette.error_container,
    },

    '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
      borderColor: variables.palette.outline,
    },
  },

  '&& .MuiSelect-select': {
    padding: theme.spacing(0.65, 1.2),
    minWidth: '14rem',
  },

  '&& .MuiFormHelperText-root': {
    display: 'none',
  },

  '&& .MuiSvgIcon-root.Mui-disabled': {
    display: 'none',
  },

  '&& .MuiOutlinedInput-notchedOutline': {
    borderColor: variables.palette.outline,
  },
});
