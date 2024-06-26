import { Order } from 'shared/types';

import { TextItemAnswer, TimeRangeItemAnswer } from './ReportTable.types';

export const filterReportTable = (item: string | null, searchValue: string) =>
  item ? String(item).toLowerCase().includes(searchValue.toLowerCase()) : false;

export const descendingComparator = <T>(a: T, b: T, orderBy: keyof T) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }

  return 0;
};

export const getComparator = <Key extends string>(
  order: Order,
  orderBy: Key,
): ((a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number) =>
  order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);

export const stableSort = <T>(array: readonly T[], comparator: (a: T, b: T) => number) => {
  const stabilized = array.map((el, index) => [el, index] as [T, number]);
  stabilized.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }

    return a[1] - b[1];
  });

  return stabilized.map((el) => el[0]);
};

export const getSimpleTextRows = (answers: TextItemAnswer[], skippedResponse: JSX.Element) =>
  answers.map(({ date, time, answer }) => ({
    date: {
      content: () => date,
      value: date,
    },
    time: {
      content: () => time,
      value: time,
    },
    answer: {
      content: () => (answer ? answer : skippedResponse),
      value: answer || '',
    },
  }));

export const getTimeRangeRows = (answers: TimeRangeItemAnswer[], skippedResponse: JSX.Element) =>
  answers.map(({ date, time, from, to }) => ({
    date: {
      content: () => date,
      value: date,
    },
    time: {
      content: () => time,
      value: time,
    },
    from: {
      content: () => (from ? from : skippedResponse),
      value: from || '',
    },
    to: {
      content: () => (to ? to : skippedResponse),
      value: to || '',
    },
  }));
