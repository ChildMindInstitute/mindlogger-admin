import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactHookForm from 'react-hook-form';
import { endOfDay, startOfDay, subDays } from 'date-fns';

import { ReportMenu } from './ReportMenu';
import { ReportMenuProps } from './ReportMenu.types';

jest.mock('shared/hooks/useRespondentLabel', () => ({
  useRespondentLabel: () => 'user: Jane Doe',
}));

const mockedActivity = {
  id: 'activity-2',
  name: 'Activity 1',
  isPerformanceTask: false,
  hasAnswer: true,
};

const mockedFlow = {
  id: 'flow-2',
  name: 'Activity 1',
  isPerformanceTask: false,
  hasAnswer: true,
};

const mockActivities = [
  {
    id: 'activity-1',
    name: 'Activity 1',
    isPerformanceTask: false,
    hasAnswer: true,
    lastAnswerDate: '2023-09-26T10:10:05.162083',
  },
  {
    id: 'activity-2',
    name: 'Activity 2',
    isPerformanceTask: false,
    hasAnswer: true,
    lastAnswerDate: '2023-09-25T10:10:05.162083',
  },
  {
    id: 'activity-3',
    name: 'Activity 3',
    isPerformanceTask: true,
    hasAnswer: true,
    lastAnswerDate: '2023-09-25T10:10:05.162083',
  },
  {
    id: 'activity-4',
    name: 'Activity 4',
    isPerformanceTask: false,
    hasAnswer: false,
    lastAnswerDate: '2023-09-25T10:10:05.162083',
  },
];

const mockFlows = [
  {
    id: 'flow-1',
    name: 'Flow 1',
    hasAnswer: true,
    lastAnswerDate: '2023-09-26T10:10:05.162083',
  },
  {
    id: 'flow-2',
    name: 'Flow 2',
    hasAnswer: true,
    lastAnswerDate: '2023-09-25T10:10:05.162083',
  },
];

const mockedSetValue = jest.fn();
const mockSetIsLoading = jest.fn();
const mockGetIdentifiersVersions = jest.fn();
const mockFetchAnswers = jest.fn();

const renderReportMenu = (props?: Partial<ReportMenuProps>) =>
  render(
    <ReportMenu
      activities={mockActivities}
      flows={[]}
      getIdentifiersVersions={mockGetIdentifiersVersions}
      fetchAnswers={mockFetchAnswers}
      setIsLoading={mockSetIsLoading}
      {...props}
    />,
  );

const testActivities = () => {
  expect(screen.getByText('Activities')).toBeInTheDocument();
  expect(screen.getByText('Activity 1')).toBeInTheDocument();
  expect(screen.getByText('Activity 2')).toBeInTheDocument();

  const activityElements = screen.getAllByTestId(/^respondents-summary-activity/);
  expect(activityElements.length).toBe(4);
};

describe('ReportMenu Component', () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    jest.spyOn(reactHookForm, 'useFormContext').mockReturnValue({ setValue: mockedSetValue });
  });

  test('renders the component with activities and empty flows', () => {
    jest.spyOn(reactHookForm, 'useWatch').mockReturnValue([mockedActivity]);
    renderReportMenu();

    testActivities();
    const preselectedActivity = screen.getByTestId('respondents-summary-activity-1');
    expect(preselectedActivity).toHaveStyle({ backgroundColor: '#e8f0f7' });

    expect(screen.queryByText('Activity Flows')).not.toBeInTheDocument();
  });

  test('renders the component with activities and flows', () => {
    jest.spyOn(reactHookForm, 'useWatch').mockReturnValue([mockedActivity]);
    renderReportMenu({ flows: mockFlows });

    testActivities();

    expect(screen.getByText('Activity Flows')).toBeInTheDocument();
    expect(screen.getByText('Flow 1')).toBeInTheDocument();
    expect(screen.getByText('Flow 2')).toBeInTheDocument();

    const flowElements = screen.getAllByTestId(/^respondents-summary-flow/);
    expect(flowElements.length).toBe(2);
  });

  test('invokes set selected entity when an Activity is clicked', async () => {
    jest.spyOn(reactHookForm, 'useWatch').mockReturnValue([mockedActivity]);
    renderReportMenu();

    const activityElement = screen.getByTestId('respondents-summary-activity-1');
    await userEvent.click(activityElement);

    const chosenActivity = {
      ...mockActivities[1],
      isFlow: false,
    };
    expect(mockedSetValue).toHaveBeenCalledWith('selectedEntity', chosenActivity);

    //set startDate end endDate to 1 week from the most recent response
    const expectedEndDate = endOfDay(new Date('2023-09-25'));
    const expectedStartDate = startOfDay(subDays(expectedEndDate, 6));
    expect(mockedSetValue).toHaveBeenCalledWith('startDate', expectedStartDate);
    expect(mockedSetValue).toHaveBeenCalledWith('endDate', expectedEndDate);

    expect(mockSetIsLoading).toHaveBeenCalledWith(true);
    expect(mockGetIdentifiersVersions).toHaveBeenCalledWith({ entity: chosenActivity });
    expect(mockFetchAnswers).toHaveBeenCalledWith({ entity: chosenActivity });
    expect(mockSetIsLoading).toHaveBeenCalledWith(false);
  });

  test('invokes set selected entity when Flow is clicked', async () => {
    jest.spyOn(reactHookForm, 'useWatch').mockReturnValue([mockedFlow]);
    renderReportMenu({ flows: mockFlows });

    const flowElement = screen.getByTestId('respondents-summary-flow-0');
    await userEvent.click(flowElement);

    const chosenFlow = {
      ...mockFlows[0],
      isFlow: true,
    };
    expect(mockedSetValue).toHaveBeenCalledWith('selectedEntity', chosenFlow);

    //set startDate end endDate to 1 week from the most recent response
    const expectedEndDate = endOfDay(new Date('2023-09-26'));
    const expectedStartDate = startOfDay(subDays(expectedEndDate, 6));
    expect(mockedSetValue).toHaveBeenCalledWith('startDate', expectedStartDate);
    expect(mockedSetValue).toHaveBeenCalledWith('endDate', expectedEndDate);

    expect(mockSetIsLoading).toHaveBeenCalledWith(true);
    expect(mockGetIdentifiersVersions).toHaveBeenCalledWith({ entity: chosenFlow });
    expect(mockFetchAnswers).toHaveBeenCalledWith({ entity: chosenFlow });
    expect(mockSetIsLoading).toHaveBeenCalledWith(false);
  });

  test('invokes set selected entity when item with no answers is clicked', async () => {
    jest.spyOn(reactHookForm, 'useWatch').mockReturnValue([mockedActivity]);
    renderReportMenu();

    const activityElement = screen.getByTestId('respondents-summary-activity-3');
    await userEvent.click(activityElement);

    const chosenActivity = {
      ...mockActivities[3],
      isFlow: false,
    };
    expect(mockedSetValue).toHaveBeenCalledWith('selectedEntity', chosenActivity);
    expect(mockSetIsLoading).not.toHaveBeenCalled();
    expect(mockGetIdentifiersVersions).not.toHaveBeenCalled();
    expect(mockFetchAnswers).not.toHaveBeenCalled();
  });

  test('invokes set selected entity when item, which is performance task is clicked ', async () => {
    jest.spyOn(reactHookForm, 'useWatch').mockReturnValue([mockedActivity]);
    renderReportMenu();

    const activityElement = screen.getByTestId('respondents-summary-activity-2');
    await userEvent.click(activityElement);

    const chosenActivity = {
      ...mockActivities[2],
      isFlow: false,
    };
    expect(mockedSetValue).toHaveBeenCalledWith('selectedEntity', chosenActivity);
    expect(mockSetIsLoading).not.toHaveBeenCalled();
    expect(mockGetIdentifiersVersions).not.toHaveBeenCalled();
    expect(mockFetchAnswers).not.toHaveBeenCalled();
  });
});
