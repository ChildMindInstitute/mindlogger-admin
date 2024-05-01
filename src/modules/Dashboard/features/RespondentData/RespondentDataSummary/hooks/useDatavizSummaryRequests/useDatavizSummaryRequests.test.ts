import mockAxios from 'jest-mock-axios';

import { mockedActivityId, mockedAppletId, mockedRespondentId } from 'shared/mock';

import * as useDecryptedIdentifiersHook from '../useDecryptedIdentifiers';
import { useDatavizSummaryRequests } from './useDatavizSummaryRequests';

const mockedGetValues = jest.fn();
const mockedSetValue = jest.fn();
jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useFormContext: () => ({
    getValues: mockedGetValues,
    setValue: mockedSetValue,
  }),
}));

const mockedUseParams = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => mockedUseParams(),
}));

describe('useDatavizSummaryRequests', () => {
  const mockedActivity = {
    id: mockedActivityId,
    name: 'Activity 1',
    isPerformanceTask: false,
    hasAnswer: true,
    lastAnswerDate: '2023-09-26T10:10:05.162083',
  };
  const mockedDecryptedIdentifiersResult = [
    {
      decryptedValue: 'ident_1',
      encryptedValue: 'some encrypted value 1',
      lastAnswerDate: '2023-09-26T10:10:05.162083',
    },
    {
      decryptedValue: 'ident_2',
      encryptedValue: 'some encrypted value 2',
      lastAnswerDate: '2023-09-26T10:10:05.162083',
    },
  ];
  const mockedVersionsReturn = [{ version: 'v1' }, { version: 'v2' }];

  beforeEach(() => {
    mockedUseParams.mockReturnValue({
      appletId: mockedAppletId,
      respondentId: mockedRespondentId,
    });
    const mockedGetDecryptedIdentifiers = jest.spyOn(
      useDecryptedIdentifiersHook,
      'useDecryptedIdentifiers',
    );
    mockedGetDecryptedIdentifiers.mockReturnValue(() =>
      Promise.resolve(mockedDecryptedIdentifiersResult),
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should call APIs and set form values', async () => {
    mockAxios.get.mockResolvedValue({
      data: { result: 'some data' },
    });
    mockAxios.get.mockResolvedValue({
      data: { result: mockedVersionsReturn },
    });

    const { getIdentifiersVersions } = useDatavizSummaryRequests();
    await getIdentifiersVersions({ activity: mockedActivity });

    expect(mockAxios.get).toHaveBeenCalledTimes(2);
    expect(mockedSetValue).toHaveBeenNthCalledWith(
      1,
      'identifiers',
      mockedDecryptedIdentifiersResult,
    );
    expect(mockedSetValue).toHaveBeenNthCalledWith(2, 'versions', [
      { id: 'v1', label: 'v1' },
      { id: 'v2', label: 'v2' },
    ]);
    expect(mockedSetValue).toHaveBeenNthCalledWith(3, 'apiVersions', mockedVersionsReturn);
  });

  test.each`
    activityProps                  | hasParams | description
    ${{}}                          | ${false}  | ${'missing appletId or respondentId'}
    ${{ hasAnswer: false }}        | ${true}   | ${'activity without answers'}
    ${{ isPerformanceTask: true }} | ${true}   | ${'performance task activity'}
  `('should not fetch answers when $description', async ({ activityProps, hasParams }) => {
    if (!hasParams) {
      mockedUseParams.mockReturnValue({});
    }

    const { getIdentifiersVersions } = useDatavizSummaryRequests();
    await getIdentifiersVersions({ activity: { ...mockedActivity, ...activityProps } });

    expect(mockAxios.get).not.toHaveBeenCalled();
    expect(mockedSetValue).not.toHaveBeenCalled();
  });

  test('should handle errors gracefully', async () => {
    mockAxios.get.mockRejectedValue(new Error('API Error'));

    const { getIdentifiersVersions } = useDatavizSummaryRequests();
    await getIdentifiersVersions({ activity: mockedActivity });

    expect(mockAxios.get).toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalled();
  });
});
