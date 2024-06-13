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

export const MAX_HOURS = 23;
export const MAX_MINUTES = 59;
export const MIN_TIME = setHours(setMinutes(new Date(), 0), 0);
export const MAX_TIME = setHours(setMinutes(new Date(), MAX_MINUTES), MAX_HOURS);
export const TIME_INTERVALS = 1;
