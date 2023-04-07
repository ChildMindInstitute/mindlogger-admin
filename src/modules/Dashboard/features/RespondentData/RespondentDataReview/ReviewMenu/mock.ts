export const getMockedResponses = (id: string, index: number) => [
  {
    id: `${id}${index}1`,
    date: new Date(2023, 0, 31, 1, 0, 0),
  },
  {
    id: `${id}${index}2`,
    date: new Date(2023, 0, 31, 7, 30, 13),
  },
  {
    id: `${id}${index}3`,
    date: new Date(2023, 0, 31, 5, 13, 22),
  },
  {
    id: `${id}${index}4`,
    date: new Date(2023, 0, 31, 4, 30, 17),
  },
];
