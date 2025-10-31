/* eslint-disable import/first, import/order */
import { vi } from 'vitest';

import { mockedActivityId2, mockedAppletId, mockedFullSubjectId1 } from 'shared/mock';

// Mock must be defined before imports that use it
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useParams: vi.fn(() => ({
      appletId: mockedAppletId,
      subjectId: mockedFullSubjectId1,
      activityId: mockedActivityId2,
    })),
  };
});

import { users } from 'modules/Dashboard/state';
import * as reduxHooks from 'redux/store/hooks';
import { applet as appletState } from 'shared/state';
import { getPreloadedState } from 'shared/tests/getPreloadedState';
import { renderHookWithProviders } from 'shared/utils/renderHookWithProviders';

import { useRespondentDataSetup } from './RespondentData.hooks';
/* eslint-enable import/first, import/order */

describe('Respondent Data hooks', () => {
  describe('useRespondentDataSetup', () => {
    const route = `/dashboard/${mockedAppletId}/participants/${mockedFullSubjectId1}/activities/${mockedActivityId2}/summary`;
    const routePath = '/dashboard/:appletId/participants/:subjectId/activities/:activityId/summary';

    test('returns an array of tab objects', () => {
      const { result } = renderHookWithProviders(useRespondentDataSetup, { route, routePath });

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
        route,
        routePath,
      });

      expect(mockDispatch).toHaveBeenCalledTimes(2);
      expect(mockDispatch).toHaveBeenCalledWith(mockGetSubjectDetails);
      expect(mockDispatch).toHaveBeenCalledWith(mockGetAppletData);
    });
  });
});
