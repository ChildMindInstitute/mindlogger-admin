import { waitFor } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';

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

describe('useRespondentAnswers', () => {
  const mockedFetchParams = {
    activity: { id: mockedActivityId } as DatavizActivity,
    endDate: new Date('2024-01-15'),
    filterByIdentifier: false,
    versions: [{ label: 'v3', id: 'v3' }],
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

  beforeEach(() => {
    mockedUseParams.mockReturnValue({
      appletId: mockedAppletId,
      respondentId: mockedRespondentId,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should fetch answers and update form values on successful API call', async () => {
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
