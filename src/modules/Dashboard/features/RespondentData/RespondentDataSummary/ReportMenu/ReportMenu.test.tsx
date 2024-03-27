import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactHookForm from 'react-hook-form';

import { ReportMenu } from './ReportMenu';

jest.mock('shared/hooks/useRespondentLabel', () => ({
  useRespondentLabel: () => 'user: Jane Doe',
}));

const mockedActivity = {
  id: 'd65e8a64-a023-4830-9c84-7433c4b96440',
  name: 'Activity 1',
  isPerformanceTask: false,
  hasAnswer: true,
};

const mockActivities = [
  { id: 'activity-1', name: 'Activity 1', isPerformanceTask: false, hasAnswer: true },
  { id: 'activity-2', name: 'Activity 2', isPerformanceTask: false, hasAnswer: true },
];

const mockedSetValue = jest.fn();
const mockSetIsLoading = jest.fn();
const mockGetIdentifiersVersions = jest.fn();
const mockFetchAnswers = jest.fn();

const renderReportMenu = () =>
  render(
    <ReportMenu
      activities={mockActivities}
      getIdentifiersVersions={mockGetIdentifiersVersions}
      fetchAnswers={mockFetchAnswers}
      setIsLoading={mockSetIsLoading}
    />,
  );

describe('ReportMenu Component', () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    jest.spyOn(reactHookForm, 'useFormContext').mockReturnValue({ setValue: mockedSetValue });
  });

  test('renders the component with activities', () => {
    jest.spyOn(reactHookForm, 'useWatch').mockReturnValue([mockedActivity]);
    renderReportMenu();

    expect(screen.getByText('Activities')).toBeInTheDocument();
    expect(screen.getByText('Activity 1')).toBeInTheDocument();
    expect(screen.getByText('Activity 2')).toBeInTheDocument();

    const activityElements = screen.getAllByTestId(/^respondents-summary-activity/);
    expect(activityElements.length).toBe(2);
  });

  test('invokes set selected activity when an activity is clicked', async () => {
    jest.spyOn(reactHookForm, 'useWatch').mockReturnValue([mockedActivity]);
    renderReportMenu();

    const activityElement = screen.getByTestId('respondents-summary-activity-1');
    await userEvent.click(activityElement);

    expect(mockedSetValue).toHaveBeenCalledWith('selectedActivity', mockActivities[1]);
    expect(mockSetIsLoading).toHaveBeenCalledWith(true);
    expect(mockGetIdentifiersVersions).toHaveBeenCalledWith({ activity: mockActivities[1] });
    expect(mockFetchAnswers).toHaveBeenCalledWith({ activity: mockActivities[1] });
    expect(mockSetIsLoading).toHaveBeenCalledWith(false);
  });
});
