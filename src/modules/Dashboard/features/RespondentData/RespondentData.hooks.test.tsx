import { mockedAppletId, mockedRespondentId } from 'shared/mock';
import { renderHookWithProviders } from 'shared/utils';
import { getPreloadedState } from 'shared/tests/getPreloadedState';
import * as reduxHooks from 'redux/store/hooks';
import { users } from 'modules/Dashboard/state';

import { useRespondentDataSetup } from './RespondentData.hooks';

const mockedUseParams = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => mockedUseParams(),
}));

describe('Respondent Data hooks', () => {
  describe('useRespondentDataSetup', () => {
    beforeEach(() => {
      mockedUseParams.mockReturnValue({
        appletId: mockedAppletId,
        respondentId: mockedRespondentId,
      });
    });

    test('returns an array of tab objects', () => {
      const { result } = renderHookWithProviders(useRespondentDataSetup);

      expect(result.current).toEqual({
        respondentDataTabs: [
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
        ],
      });
    });

    test('launches getSubjectDetails', () => {
      const mockDispatch = jest.fn();
      const mockGetSubjectDetails = jest.fn();
      jest.spyOn(reduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch);
      jest.spyOn(users.thunk, 'getSubjectDetails').mockReturnValue(mockGetSubjectDetails);
      renderHookWithProviders(useRespondentDataSetup, {
        preloadedState: getPreloadedState(),
      });

      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledWith(mockGetSubjectDetails);
    });
  });
});
