import axios from 'axios';
import { renderHook } from '@testing-library/react';

import { mockedActivityId, mockedAppletId, mockedFullSubjectId1 } from 'shared/mock';

import * as useDecryptedIdentifiersHook from '../useDecryptedIdentifiers';
import { useDatavizSummaryRequests } from './useDatavizSummaryRequests';
import { RespondentDataContext } from '../../../RespondentDataContext/RespondentDataContext.context';

const mockedGetValues = vi.fn();
const mockedSetValue = vi.fn();
const mockedSetIdentifiers = vi.fn();
const mockedSetVersions = vi.fn();
jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useFormContext: () => ({
    getValues: mockedGetValues,
    setValue: mockedSetValue,
  }),
}));

const mockedUseParams = vi.fn();

vi.mock('react-router-dom', async () => {
  // pull in the real implementation
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useParams: () => mockedUseParams,
  };
});

const renderHookWithContext = () => {
  const {
    result: { current },
  } = renderHook(() => useDatavizSummaryRequests(), {
    wrapper: ({ children }) => (
      <RespondentDataContext.Provider
        //eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        value={{
          setIdentifiers: mockedSetIdentifiers,
          setApiVersions: mockedSetVersions,
        }}
      >
        {children}
      </RespondentDataContext.Provider>
    ),
  });

  return current;
};

describe('useDatavizSummaryRequests', () => {
  const mockedActivity = {
    id: mockedActivityId,
    name: 'Activity 1',
    isPerformanceTask: false,
    hasAnswer: true,
    lastAnswerDate: '2023-09-26T10:10:05.162083',
    isFlow: false,
  };
  const mockedFlow = {
    id: 'some-flow-id',
    name: 'Flow 1',
    hasAnswer: true,
    lastAnswerDate: '2023-09-26T10:10:05.162083',
    isFlow: true,
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
      subjectId: mockedFullSubjectId1,
    });
    const mockedGetDecryptedIdentifiers = vi.spyOn(
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

  const testApiCallsAndSetValues = () => {
    expect(axios.get).toHaveBeenCalledTimes(2);
    expect(mockedSetIdentifiers).toHaveBeenCalledWith(mockedDecryptedIdentifiersResult);
    expect(mockedSetValue).toHaveBeenCalledWith('versions', [
      { id: 'v1', label: 'v1' },
      { id: 'v2', label: 'v2' },
    ]);
    expect(mockedSetVersions).toHaveBeenCalledWith(mockedVersionsReturn);
  };

  test('should call APIs and set form values for Activity', async () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: { result: 'some data' },
    });
    vi.mocked(axios.get).mockResolvedValue({
      data: { result: mockedVersionsReturn },
    });

    const { getIdentifiersVersions } = renderHookWithContext();
    await getIdentifiersVersions({
      entity: mockedFlow,
    });

    testApiCallsAndSetValues();
  });

  test('should call APIs and set form values for Flow', async () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: { result: 'some data' },
    });
    vi.mocked(axios.get).mockResolvedValue({
      data: { result: mockedVersionsReturn },
    });

    const { getIdentifiersVersions } = renderHookWithContext();
    await getIdentifiersVersions({ entity: mockedActivity });

    testApiCallsAndSetValues();
  });

  test.each`
    activityProps                  | hasParams | description
    ${{}}                          | ${false}  | ${'missing appletId or subjectId'}
    ${{ hasAnswer: false }}        | ${true}   | ${'activity without answers'}
    ${{ isPerformanceTask: true }} | ${true}   | ${'performance task activity'}
  `('should not fetch answers when $description', async ({ activityProps, hasParams }) => {
    if (!hasParams) {
      mockedUseParams.mockReturnValue({});
    }

    const { getIdentifiersVersions } = renderHookWithContext();
    await getIdentifiersVersions({ entity: { ...mockedActivity, ...activityProps } });

    expect(axios.get).not.toHaveBeenCalled();
    expect(mockedSetValue).not.toHaveBeenCalled();
  });

  test('should handle errors gracefully', async () => {
    vi.mocked(axios.get).mockRejectedValue(new Error('API Error'));

    const { getIdentifiersVersions } = renderHookWithContext();
    await getIdentifiersVersions({ entity: mockedActivity });

    expect(axios.get).toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalled();
  });
});
