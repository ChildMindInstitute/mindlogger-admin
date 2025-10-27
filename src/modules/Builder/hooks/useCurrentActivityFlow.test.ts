import { renderHook } from '@testing-library/react';
import { v4 as uuidv4 } from 'uuid';
import { vi } from 'vitest';

import { mockedAppletData } from 'shared/mock';

import { useCurrentActivityFlow } from './useCurrentActivityFlow';

const mockedExistingActivityFlow = {
  activityFlow: mockedAppletData.activityFlows[0],
  fieldName: 'activityFlows.0',
};

const mockedExistingKeydActivityFlow = {
  activityFlow: mockedAppletData.activityFlows[1],
  fieldName: 'activityFlows.1',
};

const mockedUseParams = vi.fn();
const mockedWatch = vi.fn();

// mock the module
vi.mock('react-router-dom', async () => {
  // pull in the real implementation
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useParams: () => mockedUseParams(),
  };
});

vi.mock('react-hook-form', async () => {
  // pull in the real implementation
  const actual = await vi.importActual<typeof import('react-hook-form')>('react-hook-form');

  return {
    ...actual,
    useFormContext: () => ({
      watch: mockedWatch,
    }),
  };
});

describe('useCurrentActivityFlow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test.each`
    activityFlowId                           | activityFlows                     | expected                          | description
    ${undefined}                             | ${[]}                             | ${{}}                             | ${'returns empty object if there is no activityId in url'}
    ${uuidv4()}                              | ${mockedAppletData.activityFlows} | ${{}}                             | ${"returns empty object if activity from url doesn't exist"}
    ${mockedAppletData.activityFlows[0].id}  | ${undefined}                      | ${{}}                             | ${'returns empty object if there are no activities in form'}
    ${mockedAppletData.activityFlows[0].id}  | ${mockedAppletData.activityFlows} | ${mockedExistingActivityFlow}     | ${'returns correct activity by id'}
    ${mockedAppletData.activityFlows[1].key} | ${mockedAppletData.activityFlows} | ${mockedExistingKeydActivityFlow} | ${'returns correct activity by key'}
  `('$description', ({ activityFlowId, activityFlows, expected }) => {
    mockedUseParams.mockReturnValue({ activityFlowId });
    mockedWatch.mockReturnValue(activityFlows);

    const { result } = renderHook(() => useCurrentActivityFlow());
    expect(result.current).toStrictEqual(expected);
  });
});
