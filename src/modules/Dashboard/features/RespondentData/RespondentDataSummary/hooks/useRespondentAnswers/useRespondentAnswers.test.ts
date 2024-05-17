import { waitFor } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';
import { endOfDay, startOfDay, subDays } from 'date-fns';

import { mockedActivityId, mockedAppletId, mockedRespondentId } from 'shared/mock';
import * as dashboardHooks from 'modules/Dashboard/hooks';
import { ActivityOrFlow } from 'modules/Dashboard/features/RespondentData/RespondentData.types';
import { MAX_LIMIT } from 'shared/consts';

import { useRespondentAnswers } from './useRespondentAnswers';

const mockedUseParams = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => mockedUseParams(),
}));

const mockedGetValues = jest.fn();
const mockedSetValue = jest.fn();
jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useFormContext: () => ({
    getValues: mockedGetValues,
    setValue: mockedSetValue,
  }),
}));

jest.mock('modules/Dashboard/hooks', () => ({
  ...jest.requireActual('modules/Dashboard/hooks'),
  useDecryptedActivityData: jest.fn(),
}));

const testIdentifierDatesChange = async () => {
  expect(mockedGetValues).toHaveBeenCalled();
  const endDate = endOfDay(new Date('2024-04-12'));
  const startDate = startOfDay(subDays(endDate, 6));
  expect(mockedSetValue).toHaveBeenNthCalledWith(1, 'startDate', startDate);
  expect(mockedSetValue).toHaveBeenNthCalledWith(2, 'endDate', endDate);

  await waitFor(() => {
    expect(mockAxios.get).toHaveBeenNthCalledWith(
      1,
      `/answers/applet/${mockedAppletId}/activities/${mockedActivityId}/answers`,
      {
        params: {
          emptyIdentifiers: false,
          fromDatetime: '2024-04-06T00:00:00',
          identifiers: 'encrypted_ident_1,encrypted_ident_2,encrypted_ident_2_1',
          respondentId: mockedRespondentId,
          toDatetime: '2024-04-12T23:59:00',
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
    identifiers: [],
  };
  const mockedGetValuesReturnWithIdentifier = {
    ...mockedGetValuesReturn,
    startTime: '00:00',
    endTime: '23:59',
    identifiers: [
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
    ],
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
      respondentId: mockedRespondentId,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should fetch answers and update form values on successful API call (no identifier is chosen)', async () => {
    const mockedGetDecryptedActivityData = jest.fn();
    jest
      .spyOn(dashboardHooks, 'useDecryptedActivityData')
      .mockReturnValue(mockedGetDecryptedActivityData);
    mockedGetDecryptedActivityData.mockReturnValue({ decryptedAnswers: [] });
    mockedGetValues.mockReturnValue(mockedGetValuesReturn);
    mockAxios.get.mockResolvedValue({
      data: { result: [{ version: 'v1' }, { version: 'v2' }] },
    });

    const { fetchAnswers } = useRespondentAnswers();
    await fetchAnswers(mockedFetchParams);

    expect(mockedGetValues).toHaveBeenCalled();
    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenNthCalledWith(
        1,
        `/answers/applet/${mockedAppletId}/activities/${mockedActivityId}/answers`,
        {
          params: {
            emptyIdentifiers: true,
            fromDatetime: '2024-01-12T09:00:00',
            identifiers: undefined,
            respondentId: mockedRespondentId,
            toDatetime: '2024-01-15T17:00:00',
            versions: 'v3',
            limit: MAX_LIMIT,
          },
          signal: undefined,
        },
      );
    });

    expect(mockedSetValue).toHaveBeenNthCalledWith(1, 'answers', [
      { decryptedAnswer: [], version: 'v1' },
      { decryptedAnswer: [], version: 'v2' },
    ]);
    expect(mockedSetValue).toHaveBeenNthCalledWith(2, 'responseOptions', {});
    expect(mockedSetValue).toHaveBeenNthCalledWith(3, 'subscalesFrequency', 0);
  });

  test('should fetch answers and update form values on successful API call for Activity Flow', async () => {
    const mockedGetDecryptedActivityData = jest.fn();
    jest
      .spyOn(dashboardHooks, 'useDecryptedActivityData')
      .mockReturnValue(mockedGetDecryptedActivityData);
    mockedGetDecryptedActivityData.mockReturnValue({ decryptedAnswers: [] });
    mockedGetValues.mockReturnValue(mockedGetValuesReturn);
    mockAxios.get.mockResolvedValue({
      data: { result: encryptedFlowSubmissions },
    });

    const { fetchAnswers } = useRespondentAnswers();
    await fetchAnswers(mockedFlowFetchParams);

    expect(mockedGetValues).toHaveBeenCalled();
    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenNthCalledWith(
        1,
        `/answers/applet/${mockedAppletId}/flows/${mockedFlowId}/submissions`,
        {
          params: {
            emptyIdentifiers: true,
            fromDatetime: '2024-01-12T09:00:00',
            identifiers: undefined,
            respondentId: mockedRespondentId,
            toDatetime: '2024-01-15T17:00:00',
            versions: 'v3',
            limit: MAX_LIMIT,
          },
          signal: undefined,
        },
      );
    });

    expect(mockedSetValue).toHaveBeenNthCalledWith(1, 'flowSubmissions', [
      {
        createdAt: '2024-04-26T10:37:17.554576',
        endDatetime: '2024-04-26T10:37:17.280000',
        submitId: 'ff052cfc-3d56-4a76-b10b-e5be34f6a27f',
      },
    ]);
    expect(mockedSetValue).toHaveBeenNthCalledWith(2, 'flowResponses', [
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
    mockedGetValues.mockReturnValue(mockedGetValuesReturnWithIdentifier);
    const { fetchAnswers } = useRespondentAnswers();
    await fetchAnswers(mockedFetchParamsWithIdentifier);

    await testIdentifierDatesChange();
  });

  test('should update startDate, endDate to recent chosen identifier answer date (identifier provided as form value)', async () => {
    mockedGetValues.mockReturnValue({
      ...mockedGetValuesReturnWithIdentifier,
      identifier: mockedIdentifier,
    });
    const { fetchAnswers } = useRespondentAnswers();
    await fetchAnswers({ ...mockedFetchParamsWithIdentifier, identifier: undefined });

    await testIdentifierDatesChange();
  });

  test('should update startDate, endDate to activity last answer date, if filterByIdentifier was changed to false', async () => {
    mockedGetValues.mockReturnValue(mockedGetValuesReturnWithIdentifier);

    const { fetchAnswers } = useRespondentAnswers();
    await fetchAnswers({ ...mockedFetchParamsWithIdentifier, filterByIdentifier: false });

    expect(mockedGetValues).toHaveBeenCalled();
    const endDate = endOfDay(new Date('2024-01-18'));
    const startDate = startOfDay(subDays(endDate, 6));
    expect(mockedSetValue).toHaveBeenNthCalledWith(1, 'startDate', startDate);
    expect(mockedSetValue).toHaveBeenNthCalledWith(2, 'endDate', endDate);

    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenNthCalledWith(
        1,
        `/answers/applet/${mockedAppletId}/activities/${mockedActivityId}/answers`,
        {
          params: {
            emptyIdentifiers: true,
            fromDatetime: '2024-01-12T00:00:00',
            identifiers: undefined,
            respondentId: mockedRespondentId,
            toDatetime: '2024-01-18T23:59:00',
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

    const { fetchAnswers } = useRespondentAnswers();
    await fetchAnswers(mockedFetchParams);

    expect(mockedGetValues).not.toHaveBeenCalled();
    expect(mockAxios.get).not.toHaveBeenCalled();
    expect(mockedSetValue).not.toHaveBeenCalled();
  });

  test('should handle errors gracefully', async () => {
    mockedGetValues.mockReturnValue(mockedGetValuesReturn);
    mockAxios.get.mockRejectedValue(new Error('API Error'));

    const { fetchAnswers } = useRespondentAnswers();
    await fetchAnswers(mockedFetchParams);

    expect(mockAxios.get).toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalled();
  });
});
