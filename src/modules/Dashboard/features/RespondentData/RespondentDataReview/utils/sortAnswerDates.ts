import { compareAsc } from 'date-fns';

import { AnswerDate } from 'modules/Dashboard/api';

export const sortAnswerDates = (answerDates: AnswerDate[]) =>
  answerDates?.sort((a, b) =>
    compareAsc(new Date(a.endDatetime ?? a.createdAt), new Date(b.endDatetime ?? b.createdAt)),
  );
