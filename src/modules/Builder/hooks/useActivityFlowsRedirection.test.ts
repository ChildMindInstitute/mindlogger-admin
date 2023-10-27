import { generatePath } from 'react-router-dom';
import { renderHook } from '@testing-library/react';
import { v4 as uuidv4 } from 'uuid';

import { mockedAppletData, mockedAppletId } from 'shared/mock';
import { page } from 'resources';
import { Path } from 'shared/utils';

import { useActivityFlowsRedirection } from './useActivityFlowsRedirection';

const mockedAppletIdParams = {
  appletId: mockedAppletId,
};
const mockedParamsWithExistingActivityFlow = {
  ...mockedAppletIdParams,
  activityFlowId: mockedAppletData.activityFlows[0].id,
};
const mockedParamsWithoutActivityFlow = {
  ...mockedAppletIdParams,
  activityFlowId: uuidv4(),
};
const mockedParamsNewApplet = {
  appletId: Path.NewApplet,
  activityFlowId: uuidv4(),
};
const pathToActivityFlows = generatePath(page.builderAppletActivityFlow, {
  appletId: mockedParamsWithoutActivityFlow.appletId,
});
const pathToActivityFlowsNewApplet = generatePath(page.builderAppletActivityFlow, {
  appletId: mockedParamsNewApplet.appletId,
});

const mockedUseNavigate = jest.fn();
const mockedUseParams = jest.fn();
const mockedGetValues = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
  useParams: () => mockedUseParams(),
}));
jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useFormContext: () => ({
    getValues: () => mockedGetValues(),
    watch: () => mockedGetValues(),
  }),
}));

describe('useActivityFlowsRedirection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test.each`
    params                                  | activityFlows                     | toBeCalledWith                  | description
    ${mockedParamsWithExistingActivityFlow} | ${mockedAppletData.activityFlows} | ${undefined}                    | ${'doesnt redirect if activity flow exists'}
    ${mockedParamsWithoutActivityFlow}      | ${mockedAppletData.activityFlows} | ${pathToActivityFlows}          | ${'should redirect if activity flow doesn\'t exist'}
    ${mockedParamsNewApplet}                | ${[]}                             | ${pathToActivityFlowsNewApplet} | ${'should redirect if applet is new and there are no activity flows'}
  `('$description', ({ params, activityFlows, toBeCalledWith }) => {
    mockedUseParams.mockReturnValue(params);
    mockedGetValues.mockReturnValue(activityFlows);

    renderHook(useActivityFlowsRedirection);

    toBeCalledWith
      ? expect(mockedUseNavigate).toBeCalledWith(toBeCalledWith)
      : expect(mockedUseNavigate).not.toBeCalled();
  });
});
