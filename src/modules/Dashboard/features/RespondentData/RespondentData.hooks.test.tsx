import { users } from 'modules/Dashboard/state';
import * as reduxHooks from 'redux/store/hooks';
import { mockedActivityId2, mockedAppletId, mockedFullSubjectId1 } from 'shared/mock';
import { applet as appletState } from 'shared/state';
import { getPreloadedState } from 'shared/tests/getPreloadedState';
import { renderHookWithProviders } from 'shared/utils/renderHookWithProviders';

import { useRespondentDataSetup } from './RespondentData.hooks';

const mockedUseParams = vi.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => mockedUseParams(),
}));

describe('Respondent Data hooks', () => {
  describe('useRespondentDataSetup', () => {
    beforeEach(() => {
      mockedUseParams.mockReturnValue({
        appletId: mockedAppletId,
        subjectId: mockedFullSubjectId1,
        activityId: mockedActivityId2,
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
            path: `/dashboard/${mockedAppletId}/participants/${mockedFullSubjectId1}/activities/${mockedActivityId2}/summary`,
            'data-testid': 'respondents-summary-tab-summary',
          },
          {
            labelKey: 'responses',
            id: 'respondent-data-responses',
            icon: expect.any(Object),
            activeIcon: expect.any(Object),
            path: `/dashboard/${mockedAppletId}/participants/${mockedFullSubjectId1}/activities/${mockedActivityId2}/responses`,
            'data-testid': 'respondents-summary-tab-review',
          },
        ],
      });
    });

    test('launches getSubjectDetails', () => {
      const mockDispatch = vi.fn();
      const mockGetSubjectDetails = vi.fn();
      const mockGetAppletData = vi.fn();
      vi.spyOn(reduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch);
      vi.spyOn(users.thunk, 'getSubjectDetails').mockReturnValue(mockGetSubjectDetails);
      vi.spyOn(appletState.thunk, 'getApplet').mockReturnValue(mockGetAppletData);
      renderHookWithProviders(useRespondentDataSetup, {
        preloadedState: getPreloadedState(),
      });

      expect(mockDispatch).toHaveBeenCalledTimes(2);
      expect(mockDispatch).toHaveBeenCalledWith(mockGetSubjectDetails);
      expect(mockDispatch).toHaveBeenCalledWith(mockGetAppletData);
    });
  });
});
