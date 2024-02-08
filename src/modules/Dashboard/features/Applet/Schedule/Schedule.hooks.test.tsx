import { ReactNode } from 'react';

import { renderHook, act } from '@testing-library/react';
import * as dateFns from 'date-fns';
import { Provider } from 'react-redux';

import { NotificationType, Periodicity, TimerType } from 'modules/Dashboard/api';
import { Event, calendarEvents } from 'modules/Dashboard/state';
import { setupStore } from 'redux/store';
import * as reduxHooks from 'redux/store/hooks';
import { mockedAppletData as mockedApplet } from 'shared/mock';
import { initialStateData, SingleApplet } from 'shared/state';

import { usePreparedEvents } from './Schedule.hooks';

const visibilityStateData = {
  ...initialStateData,
  data: true,
};

const getPreloadedState = (events?: Event[]) => ({
  calendarEvents: {
    events: initialStateData,
    alwaysAvailableVisible: visibilityStateData,
    scheduledVisible: visibilityStateData,
    createEventsData: initialStateData,
    calendarCurrentYear: initialStateData,
    processedEvents: initialStateData,
  },
  applets: {
    events: {
      ...initialStateData,
      ...(events && { data: { result: events, count: events.length } }),
    },
  },
});

const mockedAppletData = {
  ...mockedApplet,
  activities: [
    {
      name: 'Activity 1',
      description: '',
      splashScreen: '',
      image: '',
      showAllAtOnce: false,
      isSkippable: false,
      isReviewable: false,
      responseIsEditable: true,
      isHidden: false,
      scoresAndReports: {
        generateReport: false,
        showScoreSummary: false,
        reports: [],
      },
      subscaleSetting: null,
      reportIncludedItemName: '',
      performanceTaskType: null,
      isPerformanceTask: false,
      id: 'activity-id-1',
      order: 1,
      createdAt: '2023-12-21T15:12:34.842050',
    },
    {
      name: 'Activity 2',
      description: '',
      splashScreen: '',
      image: '',
      showAllAtOnce: false,
      isSkippable: false,
      isReviewable: false,
      responseIsEditable: true,
      isHidden: false,
      scoresAndReports: {
        generateReport: false,
        showScoreSummary: false,
        reports: [],
      },
      subscaleSetting: null,
      reportIncludedItemName: '',
      performanceTaskType: null,
      isPerformanceTask: false,
      id: 'activity-id-2',
      order: 2,
      createdAt: '2023-12-21T15:12:34.842058',
    },
    {
      name: 'Hidden Activity',
      description: '',
      splashScreen: '',
      image: '',
      showAllAtOnce: false,
      isSkippable: false,
      isReviewable: false,
      responseIsEditable: true,
      isHidden: true,
      scoresAndReports: {
        generateReport: false,
        showScoreSummary: false,
        reports: [],
      },
      subscaleSetting: null,
      reportIncludedItemName: '',
      performanceTaskType: null,
      isPerformanceTask: false,
      id: 'activity-id-hidden',
      order: 4,
      createdAt: '2023-12-21T15:12:34.842066',
    },
  ],
  activityFlows: [
    {
      name: 'Hidden Activity Flow',
      description: 'AF Hidden',
      isSingleReport: false,
      hideBadge: false,
      reportIncludedActivityName: '',
      reportIncludedItemName: '',
      isHidden: true,
      id: 'flow-id-hidden',
      order: 1,
      activityIds: ['activity-id-1', 'activity-id-2', 'activity-id-hidden'],
      createdAt: '2023-12-21T15:12:34.929742',
    },
    {
      name: 'Activity Flow 1',
      description: 'AF 1',
      isSingleReport: false,
      hideBadge: false,
      reportIncludedActivityName: '',
      reportIncludedItemName: '',
      isHidden: false,
      id: 'flow-id-1',
      order: 2,
      activityIds: ['activity-id-1', 'activity-id-2', 'activity-id-hidden'],
      createdAt: '2023-12-21T15:12:34.929750',
    },
  ],
} as unknown as SingleApplet;

const mockedEvents = [
  {
    startTime: '00:00:00',
    endTime: '23:59:00',
    accessBeforeSchedule: false,
    oneTimeCompletion: false,
    timer: 0,
    timerType: TimerType.NotSet,
    id: 'event-1',
    periodicity: {
      type: Periodicity.Always,
      startDate: null,
      endDate: null,
      selectedDate: null,
    },
    respondentId: null,
    activityId: 'activity-id-hidden',
    flowId: null,
    notification: null,
  },
  {
    startTime: '00:00:00',
    endTime: '23:59:00',
    accessBeforeSchedule: false,
    oneTimeCompletion: false,
    timer: 0,
    timerType: TimerType.NotSet,
    id: 'event-2',
    periodicity: {
      type: Periodicity.Always,
      startDate: null,
      endDate: null,
      selectedDate: null,
    },
    respondentId: null,
    activityId: null,
    flowId: 'flow-id-1',
    notification: null,
  },
  {
    startTime: '00:00:00',
    endTime: '23:59:00',
    accessBeforeSchedule: false,
    oneTimeCompletion: false,
    timer: 0,
    timerType: TimerType.NotSet,
    id: 'event-3',
    periodicity: {
      type: Periodicity.Always,
      startDate: null,
      endDate: null,
      selectedDate: null,
    },
    respondentId: null,
    activityId: null,
    flowId: 'flow-id-hidden',
    notification: null,
  },
  {
    startTime: '00:00:00',
    endTime: '23:59:00',
    accessBeforeSchedule: false,
    oneTimeCompletion: null,
    timer: null,
    timerType: TimerType.NotSet,
    id: 'event-4',
    periodicity: {
      type: Periodicity.Daily,
      startDate: '2023-12-21',
      endDate: '2024-04-30',
      selectedDate: null,
    },
    respondentId: null,
    activityId: 'activity-id-2',
    flowId: null,
    notification: null,
  },
  {
    startTime: '14:00:00',
    endTime: '11:30:00',
    accessBeforeSchedule: true,
    oneTimeCompletion: null,
    timer: 5400,
    timerType: TimerType.Timer,
    id: 'event-5',
    periodicity: {
      type: Periodicity.Weekly,
      startDate: '2023-12-21',
      endDate: '2023-12-31',
      selectedDate: '2023-12-21',
    },
    respondentId: null,
    activityId: 'activity-id-2',
    flowId: null,
    notification: {
      notifications: [
        {
          triggerType: NotificationType.Fixed,
          fromTime: null,
          toTime: null,
          atTime: '14:00:00',
          order: 1,
          id: 'notification-1',
        },
        {
          triggerType: NotificationType.Random,
          fromTime: '00:15:00',
          toTime: '11:30:00',
          atTime: null,
          order: 2,
          id: 'notification-2',
        },
      ],
      reminder: {
        activityIncomplete: 1,
        reminderTime: '11:00:00',
        id: 'reminder-1',
      },
    },
  },
  {
    startTime: '00:45:00',
    endTime: '23:59:00',
    accessBeforeSchedule: true,
    oneTimeCompletion: null,
    timer: null,
    timerType: TimerType.NotSet,
    id: 'event-6',
    periodicity: {
      type: Periodicity.Weekdays,
      startDate: '2023-12-21',
      endDate: '2023-12-31',
      selectedDate: null,
    },
    respondentId: null,
    activityId: 'activity-id-2',
    flowId: null,
    notification: null,
  },
  {
    startTime: null,
    endTime: null,
    accessBeforeSchedule: null,
    oneTimeCompletion: true,
    timer: null,
    timerType: TimerType.NotSet,
    id: 'event-7',
    periodicity: {
      type: Periodicity.Always,
      startDate: null,
      endDate: null,
      selectedDate: '2023-12-21',
    },
    respondentId: null,
    activityId: 'activity-id-1',
    flowId: null,
    notification: null,
  },
];

const defaultResult = {
  alwaysAvailableEvents: [],
  deactivatedEvents: [],
  scheduleExportCsv: [],
  scheduleExportTableData: [],
  scheduledEvents: [],
};

const expectedResult = {
  alwaysAvailableEvents: [
    {
      id: 'activity-id-1',
      name: 'Activity 1',
      isFlow: false,
      colors: ['#0b6e99', '#0b6e99'],
    },
    {
      id: 'flow-id-1',
      name: 'Activity Flow 1',
      isFlow: true,
      colors: ['#dfac03', '#dfac03'],
    },
  ],
  scheduledEvents: [
    {
      id: 'activity-id-2',
      name: 'Activity 2',
      isFlow: false,
      count: 3,
      colors: ['#0f7b6c', 'rgba(15, 123, 108, 0.3)'],
    },
  ],
  deactivatedEvents: [
    {
      id: 'activity-id-hidden',
      name: 'Hidden Activity',
      isFlow: false,
    },
    {
      id: 'flow-id-hidden',
      name: 'Hidden Activity Flow',
      isFlow: true,
    },
  ],
  scheduleExportTableData: [
    {
      activityName: {
        content: expect.any(Function),
        value: 'Activity Flow 1',
      },
      date: {
        content: expect.any(Function),
        value: '21 Dec 2023',
      },
      startTime: {
        content: expect.any(Function),
        value: '-',
      },
      endTime: {
        content: expect.any(Function),
        value: '-',
      },
      notificationTime: {
        content: expect.any(Function),
        value: '-',
      },
      frequency: {
        content: expect.any(Function),
        value: 'Always',
      },
    },
    {
      activityName: {
        content: expect.any(Function),
        value: 'Activity 2',
      },
      date: {
        content: expect.any(Function),
        value: '21 Dec 2023',
      },
      startTime: {
        content: expect.any(Function),
        value: '00:00',
      },
      endTime: {
        content: expect.any(Function),
        value: '23:59',
      },
      notificationTime: {
        content: expect.any(Function),
        value: '-',
      },
      frequency: {
        content: expect.any(Function),
        value: 'Daily',
      },
    },
    {
      activityName: {
        content: expect.any(Function),
        value: 'Activity 2',
      },
      date: {
        content: expect.any(Function),
        value: '21 Dec 2023',
      },
      startTime: {
        content: expect.any(Function),
        value: '14:00',
      },
      endTime: {
        content: expect.any(Function),
        value: '11:30',
      },
      notificationTime: {
        content: expect.any(Function),
        value: '14:00',
      },
      frequency: {
        content: expect.any(Function),
        value: 'Weekly',
      },
    },
    {
      activityName: {
        content: expect.any(Function),
        value: 'Activity 2',
      },
      date: {
        content: expect.any(Function),
        value: '21 Dec 2023',
      },
      startTime: {
        content: expect.any(Function),
        value: '00:45',
      },
      endTime: {
        content: expect.any(Function),
        value: '23:59',
      },
      notificationTime: {
        content: expect.any(Function),
        value: '-',
      },
      frequency: {
        content: expect.any(Function),
        value: 'Weekdays',
      },
    },
    {
      activityName: {
        content: expect.any(Function),
        value: 'Activity 1',
      },
      date: {
        content: expect.any(Function),
        value: '21 Dec 2023',
      },
      startTime: {
        content: expect.any(Function),
        value: '-',
      },
      endTime: {
        content: expect.any(Function),
        value: '-',
      },
      notificationTime: {
        content: expect.any(Function),
        value: '-',
      },
      frequency: {
        content: expect.any(Function),
        value: 'Always',
      },
    },
  ],
  scheduleExportCsv: [
    {
      activityName: 'Activity Flow 1',
      date: '21 Dec 2023',
      startTime: '-',
      endTime: '-',
      notificationTime: '-',
      frequency: 'Always',
    },
    {
      activityName: 'Activity 2',
      date: '21 Dec 2023',
      startTime: '00:00',
      endTime: '23:59',
      notificationTime: '-',
      frequency: 'Daily',
    },
    {
      activityName: 'Activity 2',
      date: '21 Dec 2023',
      startTime: '14:00',
      endTime: '11:30',
      notificationTime: '14:00',
      frequency: 'Weekly',
    },
    {
      activityName: 'Activity 2',
      date: '21 Dec 2023',
      startTime: '00:45',
      endTime: '23:59',
      notificationTime: '-',
      frequency: 'Weekdays',
    },
    {
      activityName: 'Activity 1',
      date: '21 Dec 2023',
      startTime: '-',
      endTime: '-',
      notificationTime: '-',
      frequency: 'Always',
    },
  ],
};

jest.mock('date-fns', () => ({
  ...jest.requireActual('date-fns'),
  getYear: jest.fn(),
}));

const getWrapper =
  (events?: Event[]) =>
  ({ children }: { children: ReactNode }) => {
    const store = setupStore(getPreloadedState(events));

    return <Provider store={store}>{children}</Provider>;
  };

const mockDispatch = jest.fn();

describe('usePreparedEvents hook', () => {
  jest.mock('redux/store/hooks', () => ({
    useAppDispatch: jest.fn(),
  }));

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should return default result if no appletData is given', () => {
    const { result } = renderHook(() => usePreparedEvents(), { wrapper: getWrapper() });

    expect(result.current).toEqual(defaultResult);
  });

  test('should return expected result if appletData is given', () => {
    const { result } = renderHook(() => usePreparedEvents(mockedAppletData), {
      wrapper: getWrapper(mockedEvents),
    });

    expect(result.current).toEqual(expectedResult);
  });

  test('should dispatch create calendar events and set create events data for same year', async () => {
    const mockedYear = 2025;
    jest.spyOn(calendarEvents, 'useCalendarCurrentYearData').mockReturnValue(mockedYear);
    (dateFns.getYear as jest.Mock).mockReturnValue(mockedYear);
    jest.spyOn(reduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch);

    await act(async () => {
      renderHook(() => usePreparedEvents(mockedAppletData), {
        wrapper: getWrapper(mockedEvents),
      });
    });

    expect(mockDispatch).nthCalledWith(1, {
      payload: expect.any(Object),
      type: 'calendarEvents/createCalendarEvents',
    });
    expect(mockDispatch).nthCalledWith(2, {
      payload: expect.any(Object),
      type: 'calendarEvents/setCreateEventsData',
    });
    expect(mockDispatch).not.toHaveBeenCalledWith({
      payload: expect.any(Object),
      type: 'calendarEvents/createNextYearEvents',
    });
  });

  test('should dispatch set create events data and create next year events for different year', async () => {
    const mockedYear = 2024;
    const mockedNextYear = 2025;
    jest.spyOn(calendarEvents, 'useCalendarCurrentYearData').mockReturnValue(mockedYear);
    (dateFns.getYear as jest.Mock).mockReturnValue(mockedNextYear);
    jest.spyOn(reduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch);

    await act(async () => {
      renderHook(() => usePreparedEvents(mockedAppletData), {
        wrapper: getWrapper(mockedEvents),
      });
    });

    expect(mockDispatch).nthCalledWith(1, {
      payload: expect.any(Object),
      type: 'calendarEvents/setCreateEventsData',
    });
    expect(mockDispatch).nthCalledWith(2, {
      payload: expect.any(Object),
      type: 'calendarEvents/createNextYearEvents',
    });
    expect(mockDispatch).not.toHaveBeenCalledWith({
      payload: expect.any(Object),
      type: 'calendarEvents/createCalendarEvents',
    });
  });
});
