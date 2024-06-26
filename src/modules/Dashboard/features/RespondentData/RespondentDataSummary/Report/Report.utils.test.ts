import { getCompletions } from './Report.utils';
import { ActivityCompletion } from '../../RespondentData.types';

describe('getCompletions', () => {
  test('returns completions for Flow submissions', () => {
    const flowSubmissions = [
      {
        submitId: '1',
        endDatetime: '2022-01-01T00:00:00.000Z',
        createdAt: '2022-01-01T00:00:00.000Z',
      },
      { submitId: '2', endDatetime: null, createdAt: '2022-01-02T00:00:00.000Z' },
    ];
    const completions = getCompletions({ isFlow: true, flowSubmissions, answers: [] });

    expect(completions).toEqual([
      {
        id: '1',
        endDatetime: '2022-01-01T00:00:00.000Z',
        areSubscalesVisible: false,
        isFlow: true,
      },
      {
        id: '2',
        endDatetime: '2022-01-02T00:00:00.000Z',
        areSubscalesVisible: false,
        isFlow: true,
      },
    ]);
  });

  test('returns completions for Activity answers', () => {
    const answers = [
      {
        answerId: '1',
        endDatetime: '2022-01-01T00:00:00.000Z',
        subscaleSetting: null,
        reviewCount: { mine: 1, other: 3 },
      },
      {
        answerId: '2',
        endDatetime: '2022-01-02T00:00:00.000Z',
        subscaleSetting: { subscales: [{ id: '1', name: 'Subscale 1' }] },
        reviewCount: { mine: 0, other: 0 },
      },
    ] as ActivityCompletion[];
    const completions = getCompletions({ isFlow: false, flowSubmissions: [], answers });

    expect(completions).toEqual([
      {
        id: '1',
        endDatetime: '2022-01-01T00:00:00.000Z',
        areSubscalesVisible: false,
        reviewCount: { mine: 1, other: 3 },
        isFlow: false,
      },
      {
        id: '2',
        endDatetime: '2022-01-02T00:00:00.000Z',
        areSubscalesVisible: true,
        reviewCount: { mine: 0, other: 0 },
        isFlow: false,
      },
    ]);
  });
});
