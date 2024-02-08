import { render, fireEvent } from '@testing-library/react';

import { RespondentDataContext } from 'modules/Dashboard/pages/RespondentData/RespondentData.context';

import { ReportMenu } from './ReportMenu';

jest.mock('shared/hooks/useRespondentLabel', () => ({
  useRespondentLabel: () => 'user: Jane Doe',
}));

describe('ReportMenu Component', () => {
  const mockActivities = [
    { id: 'activity-1', name: 'Activity 1', isPerformanceTask: false, hasAnswer: true },
    { id: 'activity-2', name: 'Activity 2', isPerformanceTask: false, hasAnswer: true },
  ];

  const mockContextValue = {
    selectedActivity: {
      id: 'activity-1',
      name: 'Activity 1',
      isPerformanceTask: false,
      hasAnswer: true,
    },
    setSelectedActivity: jest.fn(),
  };

  test('renders the component with activities', () => {
    const { getByText, getAllByTestId } = render(<ReportMenu activities={mockActivities} />, {
      wrapper: ({ children }) => (
        <RespondentDataContext.Provider value={mockContextValue}>{children}</RespondentDataContext.Provider>
      ),
    });

    expect(getByText('Activities')).toBeInTheDocument();
    expect(getByText('Activity 1')).toBeInTheDocument();
    expect(getByText('Activity 2')).toBeInTheDocument();

    const activityElements = getAllByTestId(/^respondents-summary-activity/);
    expect(activityElements.length).toBe(2);
  });

  test('invokes setSelectedActivity when an activity is clicked', () => {
    const { getByTestId } = render(<ReportMenu activities={mockActivities} />, {
      wrapper: ({ children }) => (
        <RespondentDataContext.Provider value={mockContextValue}>{children}</RespondentDataContext.Provider>
      ),
    });

    const activityElement = getByTestId('respondents-summary-activity-1');
    fireEvent.click(activityElement);

    expect(mockContextValue.setSelectedActivity).toHaveBeenCalledWith(mockActivities[1]);
  });
});
