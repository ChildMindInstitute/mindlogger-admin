import { waitFor } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';
import { endOfDay, startOfDay, subDays } from 'date-fns';

import { mockedActivityId, mockedAppletId, mockedRespondentId } from 'shared/mock';
import { DatavizActivity } from 'api';
import * as dashboardHooks from 'modules/Dashboard/hooks';

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
          targetSubjectId: mockedRespondentId,
          toDatetime: '2024-04-12T23:59:00',
          versions: 'v3',
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
  const mockedFetchParams = {
    activity: {
      id: mockedActivityId,
      lastAnswerDate: '2024-01-18T15:10:53.311000',
    } as DatavizActivity,
    endDate: new Date('2024-01-15'),
    filterByIdentifier: false,
    versions: [{ label: 'v3', id: 'v3' }],
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
            targetSubjectId: mockedRespondentId,
            toDatetime: '2024-01-15T17:00:00',
            versions: 'v3',
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
            targetSubjectId: mockedRespondentId,
            toDatetime: '2024-01-18T23:59:00',
            versions: 'v3',
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
