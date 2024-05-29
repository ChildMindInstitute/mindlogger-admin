import { setHours, setMinutes } from 'date-fns';

import theme from 'shared/styles/theme';

export const commonInputWrapperSx = {
  '& .MuiFormHelperText-root.Mui-error': {
    marginBottom: theme.spacing(-2.3),
  },
};
export const commonInputSx = {
  height: '3.6rem',
};

export const maxHours = 23;
export const maxMinutes = 59;
export const minTime = setHours(setMinutes(new Date(), 0), 0);
export const maxTime = setHours(setMinutes(new Date(), maxMinutes), maxHours);
