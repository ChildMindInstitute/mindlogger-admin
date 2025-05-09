// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { endOfYear, format } from 'date-fns';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { DateFormats } from 'shared/consts';

import {
  getEndOfYearDate,
  getFieldsToCheck,
  getInvalidActivitiesError,
  getInvalidError,
  getUploadedDate,
  getUploadedScheduleErrors,
  getUploadedTime,
  prepareImportPayload,
} from './ImportSchedulePopup.utils';
import { ImportScheduleErrors } from './ImportSchedulePopup.types';
import { dateValidationRegex } from './ImportSchedule.const';

const currentYear = new Date().getFullYear();

describe('getInvalidActivitiesError', () => {
  const errorText1 =
    'Activity does not exist in Applet TestApplet. Please enter a valid Activity name and reupload the file.';
  const errorText2 =
    'Activity InvalidActivity does not exist in Applet TestApplet. Please enter a valid Activity name and reupload the file.';
  const errorText3 =
    'Activities InvalidActivity1, InvalidActivity2 do not exist in Applet TestApplet. Please enter a valid Activity name and reupload the file.';

  test.each`
    activityNames                               | appletName      | errorText
    ${['']}                                     | ${'TestApplet'} | ${errorText1}
    ${['InvalidActivity']}                      | ${'TestApplet'} | ${errorText2}
    ${['InvalidActivity1', 'InvalidActivity2']} | ${'TestApplet'} | ${errorText3}
  `(
    'render error text for activityNames=$activityNames',
    async ({ activityNames, appletName, errorText }) => {
      const { container } = renderWithProviders(
        getInvalidActivitiesError(activityNames, appletName),
      );

      expect(container).toHaveTextContent(errorText);
    },
  );
});

describe('getInvalidError', () => {
  test('test invalid type', () => {
    const result = getInvalidError('invalid-type');
    expect(result).toBeNull();
  });

  test.each`
    type                                        | expectedText
    ${ImportScheduleErrors.StartTime}           | ${'Activity Start Time. Valid data format: HH:mm for Scheduled activity and - for Always available activity.'}
    ${ImportScheduleErrors.EndTime}             | ${'Activity End Time. Valid data format: HH:mm for Scheduled activity and - for Always available activity.'}
    ${ImportScheduleErrors.NotificationTime}    | ${'Notification Time. Valid data format: HH:mm or -.'}
    ${ImportScheduleErrors.Frequency}           | ${'Frequency. Valid data format: Always, Once, Daily, Weekly, Monthly, Weekdays.'}
    ${ImportScheduleErrors.Date}                | ${'Date. Valid data format: DD Month YYYY.'}
    ${ImportScheduleErrors.StartEndTime}        | ${'Activity End Time should not be equal to Activity Start Time.'}
    ${ImportScheduleErrors.BetweenStartEndTime} | ${'Notification Time should be between Activity Start Time and Activity End Time.'}
  `('renders error text for type=$type', ({ type, expectedText }) => {
    const { container } = renderWithProviders(getInvalidError(type));
    expect(container).toHaveTextContent(expectedText);
  });
});

describe('getUploadedDate', () => {
  test.each`
    inputDate                 | expectedOutput
    ${'01 January 2022'}      | ${new Date('2022-01-01')}
    ${'15-Feb-2023'}          | ${new Date('2023-02-15')}
    ${new Date('2021-12-25')} | ${new Date('2021-12-25')}
    ${'invalidDateString'}    | ${'invalidDateString'}
  `('returns $expectedOutput for input $inputDate', ({ inputDate, expectedOutput }) => {
    const result = getUploadedDate(inputDate);
    expect(result).toEqual(expectedOutput);
  });

  test.each`
    inputDate                 | isValid
    ${'01 January 2022'}      | ${true}
    ${'15-Feb-2023'}          | ${true}
    ${new Date('2021-12-25')} | ${false}
    ${'invalidDateString'}    | ${false}
  `('validates date format correctly for input $inputDate', ({ inputDate, isValid }) => {
    const isValidDate = dateValidationRegex.test(inputDate);
    expect(isValidDate).toBe(isValid);
  });
});

describe('getUploadedTime', () => {
  test.each`
    inputTime        | expectedOutput
    ${'12:30'}       | ${'12:30'}
    ${'3:45'}        | ${'03:45'}
    ${'invalidTime'} | ${'invalidTime'}
    ${new Date()}    | ${format(new Date(), DateFormats.Time)}
  `('returns $expectedOutput for input $inputTime', ({ inputTime, expectedOutput }) => {
    const result = getUploadedTime(inputTime);
    expect(result).toEqual(expectedOutput);
  });

  test('replaces single-digit hour with leading zero', () => {
    const result = getUploadedTime('1:15');
    expect(result).toBe('01:15');
  });
});

describe('getEndOfYearDate', () => {
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2000-01-01'));
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  const testCases = [
    {
      uploadedDate: new Date('2022-03-05'),
      expected: endOfYear(new Date('2022-03-05')),
      description: 'returns current year end date when uploadedDate is before current year',
    },
    {
      uploadedDate: new Date(new Date().getFullYear() + 1, 0, 1),
      expected: endOfYear(new Date(new Date().getFullYear() + 1, 0, 1)),
      description: 'returns future year end date when uploadedDate is after current year',
    },
  ];

  test.each(testCases)('$description', ({ uploadedDate, expected }) => {
    const result = getEndOfYearDate(uploadedDate);
    expect(result).toEqual(expected);
  });
});

describe('getFieldsToCheck', () => {
  const defaultValue = {
    activityNames: [],
    invalidStartTimeField: { data: null, id: 'invalid-start-time' },
    invalidEndTimeField: { data: null, id: 'invalid-end-time' },
    invalidNotification: { data: null, id: 'invalid-notification' },
    invalidFrequency: { data: null, id: 'invalid-frequency' },
    invalidDate: { data: null, id: 'invalid-date' },
    invalidStartEndTime: { data: null, id: 'invalid-start-end-time' },
    invalidNotificationTime: { data: null, id: 'invalid-notification-time' },
    hasInvalidData: false,
  };

  test('test when isUploadedSchedule=false', () => {
    const mockScheduleExportData = [
      {
        activityName: 'Activity 1',
        date: '06-03-2924',
        startTime: '10:00',
        endTime: '11:00',
        notificationTime: '10:00',
        frequency: 'Daily',
      },
    ];
    const result = getFieldsToCheck(mockScheduleExportData, false);
    expect(result).toEqual({ ...defaultValue, activityNames: ['Activity 1'] });
  });

  test('all fields are valid when isUploadedSchedule=true', () => {
    const mockScheduleExportData = [
      {
        activityName: 'Activity 1',
        date: '06 Mar 2024',
        startTime: '10:00',
        endTime: '11:00',
        notificationTime: '10:00',
        frequency: 'Daily',
      },
    ];
    const result = getFieldsToCheck(mockScheduleExportData, true);
    expect(result).toEqual({ ...defaultValue, activityNames: ['Activity 1'] });
  });

  test('detects invalid fields for uploaded schedule when isUploadedSchedule=true', () => {
    const mockScheduleExportData = [
      {
        activityName: 'Activity 1',
        date: 'invalid-date',
        startTime: 'invalid-time',
        endTime: 'invalid-time',
        notificationTime: '9:30',
        frequency: 'Daily',
      },
      {
        activityName: 'Activity 2',
        date: '06 Mar 2024',
        startTime: 'invalid-time',
        endTime: '19:30',
        notificationTime: 'invalid-time',
        frequency: 'invalid-frequency',
      },
    ];

    const result = getFieldsToCheck(mockScheduleExportData, true);
    expect(result).toEqual({
      ...defaultValue,
      activityNames: ['Activity 1', 'Activity 2'],
      invalidDate: { data: expect.any(Object), id: 'invalid-date' },
      invalidStartTimeField: { data: expect.any(Object), id: 'invalid-start-time' },
      invalidEndTimeField: { data: expect.any(Object), id: 'invalid-end-time' },
      invalidStartEndTime: { data: expect.any(Object), id: 'invalid-start-end-time' },
      invalidNotificationTime: { data: expect.any(Object), id: 'invalid-notification-time' },
      invalidNotification: { data: expect.any(Object), id: 'invalid-notification' },
      invalidFrequency: { data: expect.any(Object), id: 'invalid-frequency' },
      hasInvalidData: true,
    });
  });
});

describe('prepareImportPayload', () => {
  const mockUploadedEvents = [
    {
      activityName: 'Activity 1',
      date: '06 Mar 2024',
      startTime: '10:00',
      endTime: '11:00',
      notificationTime: '10:00',
      frequency: 'Once',
    },
    {
      activityName: 'Activity 2',
      date: '13 Feb 2024',
      startTime: '',
      endTime: '',
      notificationTime: '-',
      frequency: 'Always',
    },
    {
      activityName: 'Activity 3',
      date: '07 Mar 2024',
      startTime: '-',
      endTime: '-',
      notificationTime: '-',
      frequency: 'Always',
    },
  ];

  const mockAppletData = {
    displayName: 'Mock Applet',
    description: {
      en: 'Mock Applet',
    },
    about: {
      en: '',
    },

    id: 'a341e3d7-0170-4894-8823-798c58456130',
    version: '3.0.0',
    createdAt: '2024-02-13T18:10:20.530872',
    updatedAt: '2024-03-05T18:58:21.012829',
    activities: [
      {
        name: 'Mock Activity 1',
        description: {
          en: 'Mock Activity 1',
        },

        id: '96d889e2-2264-4e76-8c60-744600e770fe',
        items: [],
        createdAt: '2024-03-05T18:58:21.029663',
      },
      {
        name: 'A/B Trails iPad',
        description: {
          en: 'A/B Trails',
        },
        performanceTaskType: 'ABTrails',
        isPerformanceTask: true,
        id: 'e34b5cad-2fe2-4eeb-897a-ac61a90d68cd',
        items: [],
        createdAt: '2024-03-05T18:58:21.029670',
      },
    ],
    activityFlows: [
      {
        name: 'Mock Flow 1',
        description: {
          en: 'Mock Flow 1',
        },
        id: '559def6c-ab38-4ec7-bb2d-7160021fde02',
        items: [
          {
            activityId: 'e34b5cad-2fe2-4eeb-897a-ac61a90d68cd',
            id: '8bc7529a-b308-4bed-9eae-c09b2b464d5a',
            order: 1,
          },
          {
            activityId: '96d889e2-2264-4e76-8c60-744600e770fe',
            id: '20948ca1-5072-4013-8ed2-45d29cefa1e3',
            order: 2,
          },
        ],
        order: 1,
        createdAt: '2024-03-05T18:58:21.053244',
      },
    ],
  };

  const mockRespondentId = 'respondentId';
  test('returns prepared import payload with valid data', () => {
    const result = prepareImportPayload(mockUploadedEvents, mockAppletData, mockRespondentId);

    expect(result).toEqual([
      {
        startTime: '10:00:00',
        endTime: '11:00:00',
        accessBeforeSchedule: false,
        oneTimeCompletion: undefined,
        timerType: 'NOT_SET',
        respondentId: mockRespondentId,
        periodicity: {
          type: 'ONCE',
          selectedDate: '2024-03-06',
          startDate: undefined,
          endDate: undefined,
        },
        activityId: undefined,
        flowId: undefined,
        notification: {
          notifications: [
            {
              atTime: '10:00:00',
              triggerType: 'FIXED',
            },
          ],
          reminder: null,
        },
      },
      {
        startTime: undefined,
        endTime: undefined,
        accessBeforeSchedule: undefined,
        oneTimeCompletion: false,
        timerType: 'NOT_SET',
        respondentId: mockRespondentId,
        periodicity: {
          type: 'ALWAYS',
          selectedDate: undefined,
          startDate: '2024-02-13',
          endDate: `${currentYear}-12-31`,
        },
        activityId: undefined,
        flowId: undefined,
        notification: null,
      },
      {
        startTime: '00:00:00',
        endTime: '23:59:00',
        accessBeforeSchedule: undefined,
        oneTimeCompletion: false,
        timerType: 'NOT_SET',
        respondentId: 'respondentId',
        periodicity: {
          endDate: `${currentYear}-12-31`,
          selectedDate: undefined,
          startDate: '2024-03-07',
          type: 'ALWAYS',
        },
        activityId: undefined,
        flowId: undefined,
        notification: null,
      },
    ]);
  });
});

describe('getUploadedScheduleErrors', () => {
  const mockScheduleExportData = [
    {
      activityName: 'Activity 1',
      date: '2022-03-05',
      startTime: '10:00',
      endTime: '11:00',
      notificationTime: '10:00',
      frequency: 'Daily',
    },
  ];

  test('should return null when uploadedSchedule is missing', () => {
    const result = getUploadedScheduleErrors(mockScheduleExportData);
    expect(result).toBeNull();
  });

  test('should return correct uploaded schedule errors', () => {
    const mockUploadedSchedule = [
      {
        activityName: 'Activity 1',
        date: '2022-03-05',
        startTime: 'invalid-time',
        endTime: 'invalid-time',
        notificationTime: '9:30',
        frequency: 'Daily',
      },
      {
        activityName: 'Activity 2',
        date: '2022-03-05',
        startTime: 'invalid-time',
        endTime: '19:30',
        notificationTime: 'invalid-time',
        frequency: 'invalid-frequency',
      },
    ];

    const result = getUploadedScheduleErrors(mockScheduleExportData, mockUploadedSchedule);
    expect(result).toEqual({
      invalidDate: { data: expect.any(Object), id: 'invalid-date' },
      invalidStartTimeField: { data: expect.any(Object), id: 'invalid-start-time' },
      invalidEndTimeField: { data: expect.any(Object), id: 'invalid-end-time' },
      invalidStartEndTime: { data: expect.any(Object), id: 'invalid-start-end-time' },
      invalidNotificationTime: { data: expect.any(Object), id: 'invalid-notification-time' },
      invalidNotification: { data: expect.any(Object), id: 'invalid-notification' },
      invalidFrequency: { data: expect.any(Object), id: 'invalid-frequency' },
      hasInvalidData: true,
      notExistentActivities: ['Activity 2'],
    });
  });
});
