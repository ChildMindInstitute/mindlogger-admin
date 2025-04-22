import { renderHook, waitFor } from '@testing-library/react';
import axios from 'axios';
import { endOfDay, startOfDay, subDays } from 'date-fns';

import { mockedActivityId, mockedAppletId, mockedFullSubjectId1 } from 'shared/mock';
import * as dashboardHooks from 'modules/Dashboard/hooks';
import { ActivityOrFlow } from 'modules/Dashboard/features/RespondentData/RespondentData.types';
import { RespondentDataContext } from 'modules/Dashboard/features/RespondentData/RespondentDataContext/RespondentDataContext.context';
import { MAX_LIMIT } from 'shared/consts';

import { useRespondentAnswers } from './useRespondentAnswers';

const mockedUseParams = vi.fn();

vi.mock('react-router-dom', async () => {
  // pull in the real implementation
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useParams: () => mockedUseParams,
  };
});

const mockedGetValues = vi.fn();
const mockedSetValue = vi.fn();
jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useFormContext: () => ({
    getValues: mockedGetValues,
    setValue: mockedSetValue,
  }),
}));

jest.mock('modules/Dashboard/hooks', () => ({
  ...jest.requireActual('modules/Dashboard/hooks'),
  useDecryptedActivityData: vi.fn(),
}));

const mockedSetFlowSubmissions = vi.fn();
const mockedSetFlowResponses = vi.fn();
const mockedSetFlowResponseOptionsCount = vi.fn();
const mockedSetAnswers = vi.fn();
const mockedSetResponseOptions = vi.fn();
const mockedSetSubscalesFrequency = vi.fn();
const identifiers = [
  {
    decryptedValue: 'ident_1',
    encryptedValue: 'encrypted_ident_1',
    lastAnswerDate: '2024-01-18T15:10:53.311000',
  },
  {
    decryptedValue: 'ident_2',
    encryptedValue: 'encrypted_ident_2',
    lastAnswerDate: '2024-02-18T15:13:00.338000',
  },
  {
    decryptedValue: 'ident_2',
    encryptedValue: 'encrypted_ident_2_1',
    lastAnswerDate: '2024-04-12T13:35:41.847000',
  },
  {
    decryptedValue: 'ident_3',
    encryptedValue: 'encrypted_ident_3',
    lastAnswerDate: '2024-03-01T12:13:53.378000',
  },
];

const renderHookWithContext = () => {
  const {
    result: { current },
  } = renderHook(() => useRespondentAnswers(), {
    wrapper: ({ children }) => (
      <RespondentDataContext.Provider
        //eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        value={{
          setFlowSubmissions: mockedSetFlowSubmissions,
          setFlowResponses: mockedSetFlowResponses,
          setFlowResponseOptionsCount: mockedSetFlowResponseOptionsCount,
          setAnswers: mockedSetAnswers,
          setResponseOptions: mockedSetResponseOptions,
          setSubscalesFrequency: mockedSetSubscalesFrequency,
          identifiers,
        }}
      >
        {children}
      </RespondentDataContext.Provider>
    ),
  });

  return current;
};

const testIdentifierDatesChange = async () => {
  expect(mockedGetValues).toHaveBeenCalled();
  const endDate = endOfDay(new Date('2024-04-12'));
  const startDate = startOfDay(subDays(endDate, 6));
  expect(mockedSetValue).toHaveBeenNthCalledWith(1, 'startDate', startDate);
  expect(mockedSetValue).toHaveBeenNthCalledWith(2, 'endDate', endDate);

  await waitFor(() => {
    expect(axios.get).toHaveBeenNthCalledWith(
      1,
      `/answers/applet/${mockedAppletId}/activities/${mockedActivityId}/answers`,
      {
        params: {
          emptyIdentifiers: false,
          fromDatetime: '2024-04-06T09:00:00',
          identifiers: 'encrypted_ident_1,encrypted_ident_2,encrypted_ident_2_1',
          targetSubjectId: mockedFullSubjectId1,
          toDatetime: '2024-04-12T17:00:00',
          versions: 'v3',
          limit: MAX_LIMIT,
        },
        signal: undefined,
      },
    );
  });
};

describe('useRespondentAnswers', () => {
  const mockedIdentifier = [
    { id: 'ident_1', label: 'ident_1' },
    { id: 'ident_2', label: 'ident_2' },
  ];
  const commonFetchParams = {
    endDate: new Date('2024-01-15'),
    filterByIdentifier: false,
    versions: [{ label: 'v3', id: 'v3' }],
  };
  const mockedFetchParams = {
    entity: {
      id: mockedActivityId,
      lastAnswerDate: '2024-01-18T15:10:53.311000',
      isFlow: false,
    } as ActivityOrFlow,
    ...commonFetchParams,
  };
  const mockedFlowId = 'flow-id-333';
  const mockedFlowFetchParams = {
    entity: {
      id: mockedFlowId,
      lastAnswerDate: '2024-01-18T15:10:53.311000',
      isFlow: true,
    } as ActivityOrFlow,
    ...commonFetchParams,
  };
  const mockedFetchParamsWithIdentifier = {
    ...mockedFetchParams,
    filterByIdentifier: true,
    isIdentifiersChange: true,
    identifier: mockedIdentifier,
  };
  const mockedGetValuesReturn = {
    startDate: new Date('2024-01-12'),
    endDate: new Date('2024-01-11'),
    startTime: '09:00',
    endTime: '17:00',
    filterByIdentifier: true,
    versions: [{ id: 'v1' }, { id: 'v2' }],
    identifier: '',
  };

  const encryptedFlowSubmissions = {
    submissions: [
      {
        submitId: 'ff052cfc-3d56-4a76-b10b-e5be34f6a27f',
        flowHistoryId: '44e5dfc7-2a94-480b-8bf6-1f0177bb0127_4.8.6',
        createdAt: '2024-04-26T10:37:17.554576',
        endDatetime: '2024-04-26T10:37:17.280000',
        answers: [
          {
            id: 'c9e3d9e7-e4ba-42c6-955f-d214926fc212',
            submitId: 'ff052cfc-3d56-4a76-b10b-e5be34f6a27f',
            version: '4.8.6',
            activityHistoryId: '618e0577-6f99-45d9-a73b-398d8bbabaf5_4.8.6',
            activityId: '618e0577-6f99-45d9-a73b-398d8bbabaf5',
            flowHistoryId: '44e5dfc7-2a94-480b-8bf6-1f0177bb0127_4.8.6',
            userPublicKey: '',
            answer: 'encrypted-answers',
            events: 'encrypted-events',
            itemIds: [
              'e9247f7c-b588-4f81-a59c-286e54313273',
              '1df5abf0-bf96-462e-945d-92879176829e',
              '2d096af6-c614-4276-9bae-5559dbe865ba',
              '74275c06-129a-4a2d-abac-3f052829556a',
            ],
            identifier: 'identifier',
            migratedData: null,
            endDatetime: '2024-04-26T10:36:37.020000',
            createdAt: '2024-04-26T10:36:37.690416',
          },
        ],
      },
    ],
    flows: [
      {
        name: 'All activities in flow',
        id: '44e5dfc7-2a94-480b-8bf6-1f0177bb0127',
        idVersion: '44e5dfc7-2a94-480b-8bf6-1f0177bb0127_4.8.6',
        activities: [
          {
            id: '618e0577-6f99-45d9-a73b-398d8bbabaf5',
            idVersion: '618e0577-6f99-45d9-a73b-398d8bbabaf5_4.8.6',
            name: 'Activity__1',
            scoresAndReports: {
              generateReport: false,
              showScoreSummary: false,
              reports: [],
            },
            subscaleSetting: {
              calculateTotalScore: null,
              subscales: [],
              totalScoresTableData: null,
            },
            performanceTaskType: null,
            items: [
              {
                question: {
                  en: 'Your age:',
                },
                responseType: 'singleSelect',
                responseValues: {
                  type: 'singleSelect',
                  paletteName: null,
                  options: [],
                },
                name: 'Item1',
                id: 'e9247f7c-b588-4f81-a59c-286e54313273',
                idVersion: 'e9247f7c-b588-4f81-a59c-286e54313273_4.8.6',
                activityId: '618e0577-6f99-45d9-a73b-398d8bbabaf5_4.8.6',
                order: 1,
              },
              {
                question: {
                  en: 'How did you sleep last night 22?',
                },
                responseType: 'numberSelect',
                responseValues: {
                  type: 'numberSelect',
                  minValue: 0,
                  maxValue: 1,
                },
                name: 'Item2',
                id: '1df5abf0-bf96-462e-945d-92879176829e',
                idVersion: '1df5abf0-bf96-462e-945d-92879176829e_4.8.6',
                activityId: '618e0577-6f99-45d9-a73b-398d8bbabaf5_4.8.6',
                order: 2,
              },
              {
                question: {
                  en: 'About what time did you go to bed last night?',
                },
                responseType: 'time',
                responseValues: null,
                name: 'Item3',
                id: '2d096af6-c614-4276-9bae-5559dbe865ba',
                idVersion: '2d096af6-c614-4276-9bae-5559dbe865ba_4.8.6',
                activityId: '618e0577-6f99-45d9-a73b-398d8bbabaf5_4.8.6',
                order: 3,
              },
            ],
          },
        ],
      },
    ],
  };

  beforeEach(() => {
    mockedUseParams.mockReturnValue({
      appletId: mockedAppletId,
      subjectId: mockedFullSubjectId1,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should fetch answers and update form values on successful API call (no identifier is chosen)', async () => {
    const mockedGetDecryptedActivityData = vi.fn();
    vi.spyOn(dashboardHooks, 'useDecryptedActivityData').mockReturnValue(
      mockedGetDecryptedActivityData,
    );
    mockedGetDecryptedActivityData.mockReturnValue({ decryptedAnswers: [] });
    mockedGetValues.mockReturnValue(mockedGetValuesReturn);
    vi.mocked(axios.get).mockResolvedValue({
      data: { result: [{ version: 'v1' }, { version: 'v2' }] },
    });

    const { fetchAnswers } = renderHookWithContext();
    await fetchAnswers(mockedFetchParams);

    expect(mockedGetValues).toHaveBeenCalled();
    await waitFor(() => {
      expect(axios.get).toHaveBeenNthCalledWith(
        1,
        `/answers/applet/${mockedAppletId}/activities/${mockedActivityId}/answers`,
        {
          params: {
            emptyIdentifiers: true,
            fromDatetime: '2024-01-12T09:00:00',
            identifiers: undefined,
            targetSubjectId: mockedFullSubjectId1,
            toDatetime: '2024-01-15T17:00:00',
            versions: 'v3',
            limit: MAX_LIMIT,
          },
          signal: undefined,
        },
      );
    });

    expect(mockedSetAnswers).toHaveBeenCalledWith([
      { decryptedAnswer: [], version: 'v1' },
      { decryptedAnswer: [], version: 'v2' },
    ]);
    expect(mockedSetResponseOptions).toHaveBeenCalledWith({});
    expect(mockedSetSubscalesFrequency).toHaveBeenCalledWith(0);
  });

  test('should fetch answers and update form values on successful API call for Activity Flow', async () => {
    const mockedGetDecryptedActivityData = vi.fn();
    vi.spyOn(dashboardHooks, 'useDecryptedActivityData').mockReturnValue(
      mockedGetDecryptedActivityData,
    );
    mockedGetDecryptedActivityData.mockReturnValue({ decryptedAnswers: [] });
    mockedGetValues.mockReturnValue(mockedGetValuesReturn);
    vi.mocked(axios.get).mockResolvedValue({
      data: { result: encryptedFlowSubmissions },
    });

    const { fetchAnswers } = renderHookWithContext();
    await fetchAnswers(mockedFlowFetchParams);

    expect(mockedGetValues).toHaveBeenCalled();
    await waitFor(() => {
      expect(axios.get).toHaveBeenNthCalledWith(
        1,
        `/answers/applet/${mockedAppletId}/flows/${mockedFlowId}/submissions`,
        {
          params: {
            emptyIdentifiers: true,
            fromDatetime: '2024-01-12T09:00:00',
            identifiers: undefined,
            targetSubjectId: mockedFullSubjectId1,
            toDatetime: '2024-01-15T17:00:00',
            versions: 'v3',
            limit: MAX_LIMIT,
          },
          signal: undefined,
        },
      );
    });

    expect(mockedSetFlowSubmissions).toHaveBeenCalledWith([
      {
        createdAt: '2024-04-26T10:37:17.554576',
        endDatetime: '2024-04-26T10:37:17.280000',
        submitId: 'ff052cfc-3d56-4a76-b10b-e5be34f6a27f',
      },
    ]);
    expect(mockedSetFlowResponses).toHaveBeenCalledWith([
      {
        activityId: '618e0577-6f99-45d9-a73b-398d8bbabaf5',
        activityName: 'Activity__1',
        answers: [
          {
            activityHistoryId: '618e0577-6f99-45d9-a73b-398d8bbabaf5_4.8.6',
            activityId: '618e0577-6f99-45d9-a73b-398d8bbabaf5',
            answerId: 'c9e3d9e7-e4ba-42c6-955f-d214926fc212',
            createdAt: '2024-04-26T10:36:37.690416',
            decryptedAnswer: [],
            endDatetime: '2024-04-26T10:36:37.020000',
            events: 'encrypted-events',
            flowHistoryId: '44e5dfc7-2a94-480b-8bf6-1f0177bb0127_4.8.6',
            id: 'c9e3d9e7-e4ba-42c6-955f-d214926fc212',
            identifier: 'identifier',
            migratedData: null,
            submitId: 'ff052cfc-3d56-4a76-b10b-e5be34f6a27f',
            subscaleSetting: {
              calculateTotalScore: null,
              subscales: [],
              totalScoresTableData: null,
            },
            version: '4.8.6',
          },
        ],
        isPerformanceTask: false,
        responseOptions: {},
        subscalesFrequency: 0,
      },
    ]);
  });

  test('should update startDate, endDate to recent chosen identifier answer date (identifier provided with function params)', async () => {
    mockedGetValues.mockReturnValue(mockedGetValuesReturn);
    const { fetchAnswers } = renderHookWithContext();
    await fetchAnswers(mockedFetchParamsWithIdentifier);

    await testIdentifierDatesChange();
  });

  test('should update startDate, endDate to recent chosen identifier answer date (identifier provided as form value)', async () => {
    mockedGetValues.mockReturnValue({
      ...mockedGetValuesReturn,
      identifier: mockedIdentifier,
    });
    const { fetchAnswers } = renderHookWithContext();
    await fetchAnswers({ ...mockedFetchParamsWithIdentifier, identifier: undefined });

    await testIdentifierDatesChange();
  });

  test('should update startDate, endDate to activity last answer date, if filterByIdentifier was changed to false', async () => {
    mockedGetValues.mockReturnValue(mockedGetValuesReturn);

    const { fetchAnswers } = renderHookWithContext();
    await fetchAnswers({ ...mockedFetchParamsWithIdentifier, filterByIdentifier: false });

    expect(mockedGetValues).toHaveBeenCalled();
    const endDate = endOfDay(new Date('2024-01-18'));
    const startDate = startOfDay(subDays(endDate, 6));
    expect(mockedSetValue).toHaveBeenNthCalledWith(1, 'startDate', startDate);
    expect(mockedSetValue).toHaveBeenNthCalledWith(2, 'endDate', endDate);

    await waitFor(() => {
      expect(axios.get).toHaveBeenNthCalledWith(
        1,
        `/answers/applet/${mockedAppletId}/activities/${mockedActivityId}/answers`,
        {
          params: {
            emptyIdentifiers: true,
            fromDatetime: '2024-01-12T09:00:00',
            identifiers: undefined,
            targetSubjectId: mockedFullSubjectId1,
            toDatetime: '2024-01-18T17:00:00',
            versions: 'v3',
            limit: MAX_LIMIT,
          },
          signal: undefined,
        },
      );
    });
  });

  test('should not fetch answers when appletId or respondentId is missing', async () => {
    mockedUseParams.mockReturnValue({});

    const { fetchAnswers } = renderHookWithContext();
    await fetchAnswers(mockedFetchParams);

    expect(mockedGetValues).not.toHaveBeenCalled();
    expect(axios.get).not.toHaveBeenCalled();
    expect(mockedSetValue).not.toHaveBeenCalled();
  });

  test('should handle errors gracefully', async () => {
    mockedGetValues.mockReturnValue(mockedGetValuesReturn);
    vi.mocked(axios.get).mockRejectedValue(new Error('API Error'));

    const { fetchAnswers } = renderHookWithContext();
    await fetchAnswers(mockedFetchParams);

    expect(axios.get).toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalled();
  });
});
