import { format } from 'date-fns';

import { DAY_FORMAT, DAY_FORMAT_WITH_WEEK_DAY } from 'consts';

export const getStringFromDate = (date: Date | null) => date && String(format(date, DAY_FORMAT));

export const getStringFromDateWithWeekDay = (date: Date | null) =>
  date && String(format(date, DAY_FORMAT_WITH_WEEK_DAY));
