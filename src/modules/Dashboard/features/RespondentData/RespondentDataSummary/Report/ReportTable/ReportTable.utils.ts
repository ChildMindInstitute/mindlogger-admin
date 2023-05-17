import { format } from 'date-fns';

import { DateFormats } from 'shared/consts';

import { ItemAnswer } from '../Report.types';

export const getRows = (answers: ItemAnswer[]) =>
  answers.map(({ date, value }) => {
    const formattedDate = format(new Date(date), DateFormats.DayMonthYear);
    const formattedTime = format(new Date(date), DateFormats.Time);

    return {
      date: {
        content: () => formattedDate,
        value: formattedDate,
      },
      time: {
        content: () => formattedTime,
        value: formattedTime,
      },
      response: {
        content: () => value,
        value: value as string | number,
      },
    };
  });
