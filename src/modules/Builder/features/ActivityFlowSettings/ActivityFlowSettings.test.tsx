// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { useCustomFormContext } from 'modules/Builder/hooks';
import { page } from 'resources';

import { ActivityFlowSettings } from './ActivityFlowSettings';

const mockWatch = vi.fn();
const mockUseNavigate = vi.fn();

const routePath = page.builderAppletActivityFlowItemSettings;
const dataTestid = 'builder-activity-flows-settings-report-config';
const mockActivityFlows = [
  {
    id: '123',
    name: 'ActivityFlow 1',
    description: 'Description 1',
    items: [{ activityKey: 'activity1' }],
  },
];

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate,
}));

jest.mock('modules/Builder/hooks', () => ({
  ...jest.requireActual('modules/Builder/hooks'),
  useCustomFormContext: vi.fn(),
  useRedirectIfNoMatchedActivityFlow: vi.fn(),
}));

const testActivityFlowSettings = async ({ disableButton }) => {
  expect(screen.getByText('Activity Flow Settings')).toBeInTheDocument();
  expect(screen.getByText('Reports')).toBeInTheDocument();

  const reportConfig = screen.getByTestId(dataTestid);

  expect(reportConfig).toBeInTheDocument();

  disableButton
    ? expect(reportConfig).toHaveAttribute('disabled')
    : expect(reportConfig).not.toHaveAttribute('disabled');
  expect(screen.getByText('Report Configuration')).toBeInTheDocument();

  if (!disableButton) {
    await userEvent.click(reportConfig);
    expect(mockUseNavigate).toHaveBeenCalledWith(
      '/builder/appletId/activity-flows/123/settings/report-configuration',
    );
  }
};

describe('ActivityFlowSettings', () => {
  beforeEach(() => {
    useCustomFormContext.mockReturnValue({ watch: mockWatch });
    mockWatch.mockReturnValueOnce(mockActivityFlows);
    vi.clearAllMocks();
  });

  test('renders ActivityFlowSettings component with mock data and enabled report config', () => {
    renderWithProviders(<ActivityFlowSettings />, {
      route: '/builder/appletId/activity-flows/123/settings',
      routePath,
    });

    testActivityFlowSettings({ disableButton: false });
  });

  test('renders ActivityFlowSettings component with mock data and disabled report config', () => {
    renderWithProviders(<ActivityFlowSettings />, {
      route: '/builder/appletId/activity-flows/456/settings',
      routePath,
    });

    testActivityFlowSettings({ disableButton: true });
  });
});
