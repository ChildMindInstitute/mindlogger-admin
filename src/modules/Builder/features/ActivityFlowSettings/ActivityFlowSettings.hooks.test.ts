// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useCustomFormContext } from 'modules/Builder/hooks';
import { renderHookWithProviders } from 'shared/utils/renderHookWithProviders';
import { page } from 'resources';

import { useActivityFlow } from './ActivityFlowSettings.hooks';

const routePath = page.builderAppletActivityFlowItemSettings;

jest.mock('modules/Builder/hooks', () => ({
  ...jest.requireActual('modules/Builder/hooks'),
  useCustomFormContext: jest.fn(),
}));

describe('useActivityFlow', () => {
  const mockWatch = jest.fn();
  const mockActivityFlows = [
    {
      id: '123',
      name: 'ActivityFlow 1',
      description: 'Description 1',
      items: [{ activityKey: 'activity1' }],
    },
    {
      id: '456',
      name: 'ActivityFlow 2',
      description: 'Description 2',
      items: [{ activityKey: 'activity2' }],
    },
  ];

  beforeEach(() => {
    useCustomFormContext.mockReturnValue({ watch: mockWatch });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return currentActivityFlow based on activityFlowId', () => {
    mockWatch.mockReturnValueOnce(mockActivityFlows);

    const { result } = renderHookWithProviders(useActivityFlow, {
      route: '/builder/appletId/activity-flows/123/settings',
      routePath,
    });

    expect(useCustomFormContext).toHaveBeenCalled();
    expect(result.current).toEqual(mockActivityFlows[0]);
  });

  test('should return undefined if activityFlowId is not found', () => {
    mockWatch.mockReturnValueOnce(mockActivityFlows);

    const { result } = renderHookWithProviders(useActivityFlow, {
      route: '/builder/appletId/activity-flows/789/settings',
      routePath,
    });

    expect(result.current).toBeUndefined();
  });
});
