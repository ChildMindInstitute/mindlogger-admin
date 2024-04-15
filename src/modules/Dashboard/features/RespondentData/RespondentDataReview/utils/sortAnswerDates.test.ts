import { sortAnswerDates } from './sortAnswerDates';

describe('sortAnswerDates', () => {
  const answerDates1 = [
    { answerId: '1', createdAt: '2024-04-09T01:10:02', endDatetime: '2024-04-10T01:11:05' },
    { answerId: '2', createdAt: '2024-04-01T23:29:36' },
    { answerId: '3', createdAt: '2024-04-15T02:10:02', endDatetime: '2024-04-15T02:10:02' },
    { answerId: '4', createdAt: '2024-04-11T11:30:01', endDatetime: '2024-04-11T11:30:33' },
    { answerId: '5', createdAt: '2024-04-11T10:20:01', endDatetime: '2024-04-11T10:20:05' },
  ];
  const expected1 = [
    { answerId: '2', createdAt: '2024-04-01T23:29:36' },
    {
      answerId: '1',
      createdAt: '2024-04-09T01:10:02',
      endDatetime: '2024-04-10T01:11:05',
    },
    { answerId: '5', createdAt: '2024-04-11T10:20:01', endDatetime: '2024-04-11T10:20:05' },
    {
      answerId: '4',
      createdAt: '2024-04-11T11:30:01',
      endDatetime: '2024-04-11T11:30:33',
    },
    { answerId: '3', createdAt: '2024-04-15T02:10:02', endDatetime: '2024-04-15T02:10:02' },
  ];
  const answerDates2 = [
    {
      answerId: '1',
      createdAt: '2024-04-10T11:30:01',
      endDatetime: '2024-04-12T12:30:01',
    },
  ];
  const answerDates3 = [
    { answerId: '1', createdAt: '2024-04-10T12:30:01', endDatetime: '2024-04-12T14:30:15' },
    {
      answerId: '2',
      createdAt: '2024-04-10T12:30:01',
      endDatetime: '2024-04-11T16:40:05',
    },
    { answerId: '3', createdAt: '2024-04-10T12:30:01', endDatetime: '2024-04-10T22:30:03' },
  ];
  const expected3 = [
    {
      answerId: '3',
      createdAt: '2024-04-10T12:30:01',
      endDatetime: '2024-04-10T22:30:03',
    },
    { answerId: '2', createdAt: '2024-04-10T12:30:01', endDatetime: '2024-04-11T16:40:05' },
    {
      answerId: '1',
      createdAt: '2024-04-10T12:30:01',
      endDatetime: '2024-04-12T14:30:15',
    },
  ];

  test.each`
    answerDates     | expected        | description
    ${answerDates1} | ${expected1}    | ${'should sort answer dates in ascending order based on endDatetime or createdAt if endDatetime is null'}
    ${[]}           | ${[]}           | ${'should return an empty array if answerDates is empty'}
    ${answerDates2} | ${answerDates2} | ${'should return the same array if answerDates contains only one element'}
    ${answerDates3} | ${expected3}    | ${'should return a sorted array if answerDates contains multiple elements with the same createdAt'}
  `('$description', ({ answerDates, expected }) => {
    const sortedAnswerDates = sortAnswerDates(answerDates);
    expect(sortedAnswerDates).toEqual(expected);
  });
});
