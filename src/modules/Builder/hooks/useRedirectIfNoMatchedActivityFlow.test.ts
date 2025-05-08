import { generatePath } from 'react-router-dom';
import { renderHook } from '@testing-library/react';
import { v4 as uuidv4 } from 'uuid';
import { vi } from 'vitest';

import { mockedAppletData, mockedAppletId } from 'shared/mock';
import { useCheckIfNewApplet } from 'shared/hooks';
import { page } from 'resources';
import { Path } from 'shared/utils';

import { useRedirectIfNoMatchedActivityFlow } from './useRedirectIfNoMatchedActivityFlow';

const mockedAppletIdParams = {
  appletId: mockedAppletId,
};
const mockedParamsWithActivityFlow = {
  ...mockedAppletIdParams,
  activityFlowId: mockedAppletData.activityFlows[0].id,
};
const mockedParamsWithoutActivityFlow = {
  ...mockedAppletIdParams,
  activityFlowId: uuidv4(),
};
const mockedParamsNewAppletWithActivityFlow = {
  appletId: Path.NewApplet,
  activityFlowId: mockedAppletData.activityFlows[0].id,
};
const mockedParamsNewAppletWithoutActivityFlow = {
  appletId: Path.NewApplet,
  activityFlowId: uuidv4(),
};
const pathToActivityFlows = generatePath(page.builderAppletActivityFlow, {
  appletId: mockedParamsWithActivityFlow.appletId,
});
const pathToActivityFlowsNewApplet = generatePath(page.builderAppletActivityFlow, {
  appletId: mockedParamsNewAppletWithActivityFlow.appletId,
});

const mockedUseNavigate = vi.fn();
const mockedUseParams = vi.fn();
const mockedGetValues = vi.fn();

// mock the module
vi.mock('react-router-dom', async () => {
  // pull in the real implementation
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useNavigate: vi.fn(() => mockedUseNavigate),
    useParams: vi.fn(() => mockedUseParams()),
  };
});

vi.mock('react-hook-form', () => ({
  ...vi.importActual('react-hook-form'),
  useFormContext: () => ({
    getValues: () => mockedGetValues(),
    watch: () => mockedGetValues(),
  }),
}));

vi.mock('shared/hooks', () => ({
  useCheckIfNewApplet: vi.fn(),
}));

describe('useRedirectIfNoMatchedActivityFlow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test.each`
    params                                      | activityFlows                     | toBeCalledWith                  | description
    ${mockedParamsWithActivityFlow}             | ${mockedAppletData.activityFlows} | ${undefined}                    | ${"doesn't redirect if activity flow exists"}
    ${mockedParamsNewAppletWithActivityFlow}    | ${mockedAppletData.activityFlows} | ${undefined}                    | ${"doesn't redirect if applet is new and activity flow exists"}
    ${mockedParamsWithoutActivityFlow}          | ${mockedAppletData.activityFlows} | ${pathToActivityFlows}          | ${"should redirect if activity flow doesn't exist"}
    ${mockedParamsNewAppletWithoutActivityFlow} | ${mockedAppletData.activityFlows} | ${pathToActivityFlowsNewApplet} | ${"should redirect if applet is new and activity flow doesn't exist"}
  `('$description', ({ params, activityFlows, toBeCalledWith }) => {
    mockedUseParams.mockReturnValue(params);
    mockedGetValues.mockReturnValue(activityFlows);

    // Mock useCheckIfNewApplet to return true for new applet test cases
    vi.mocked(useCheckIfNewApplet).mockReturnValue(params.appletId === Path.NewApplet);

    renderHook(useRedirectIfNoMatchedActivityFlow);

    toBeCalledWith
      ? expect(mockedUseNavigate).toBeCalledWith(toBeCalledWith)
      : expect(mockedUseNavigate).not.toBeCalled();
  });
});
