import { renderHook } from '@testing-library/react';

import { mockedAppletId, mockedRespondentId } from 'shared/mock';

import { useRespondentDataTabs } from './RespondentData.hooks';

const mockedUseParams = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => mockedUseParams(),
}));

describe('useRespondentDataTabs', () => {
  test('returns an array of tab objects', () => {
    mockedUseParams.mockReturnValue({ appletId: mockedAppletId, respondentId: mockedRespondentId });
    const { result } = renderHook(useRespondentDataTabs);

    expect(result.current).toEqual([
      {
        labelKey: 'summary',
        id: 'respondent-data-summary',
        icon: expect.any(Object),
        activeIcon: expect.any(Object),
        path: `/dashboard/${mockedAppletId}/respondents/${mockedRespondentId}/dataviz/summary`,
        'data-testid': 'respondents-summary-tab-summary',
      },
      {
        labelKey: 'responses',
        id: 'respondent-data-responses',
        icon: expect.any(Object),
        activeIcon: expect.any(Object),
        path: `/dashboard/${mockedAppletId}/respondents/${mockedRespondentId}/dataviz/responses`,
        'data-testid': 'respondents-summary-tab-review',
      },
    ]);
  });
});
