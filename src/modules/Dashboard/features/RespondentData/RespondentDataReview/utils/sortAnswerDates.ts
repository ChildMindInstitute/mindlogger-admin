import { compareAsc } from 'date-fns';

export const sortAnswerDates = <T extends { endDatetime?: string; createdAt: string }>(
  answerDates: T[],
) =>
  answerDates?.sort((a, b) =>
    compareAsc(new Date(a.endDatetime ?? a.createdAt), new Date(b.endDatetime ?? b.createdAt)),
  );
