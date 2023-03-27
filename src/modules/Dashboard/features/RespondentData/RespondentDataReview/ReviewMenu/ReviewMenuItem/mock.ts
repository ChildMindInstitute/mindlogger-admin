import uniqueId from 'lodash.uniqueid';

export const mockedReviews = [
  {
    id: uniqueId(),
    date: new Date(2023, 0, 31, 1, 0, 0),
  },
  {
    id: uniqueId(),
    date: new Date(2023, 0, 31, 7, 30, 13),
  },
  {
    id: uniqueId(),
    date: new Date(2023, 0, 31, 5, 13, 22),
  },
  {
    id: uniqueId(),
    date: new Date(2023, 0, 31, 4, 30, 17),
  },
];
