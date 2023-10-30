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
    params                                      | activityFlows                     | toBeCalledWith                  | description
    ${mockedParamsWithActivityFlow}             | ${mockedAppletData.activityFlows} | ${undefined}                    | ${'doesn\'t redirect if activity flow exists'}
    ${mockedParamsNewAppletWithActivityFlow}    | ${mockedAppletData.activityFlows} | ${undefined}                    | ${'doesn\'t redirect if applet is new and activity flow exists'}
    ${mockedParamsWithoutActivityFlow}          | ${mockedAppletData.activityFlows} | ${pathToActivityFlows}          | ${'should redirect if activity flow doesn\'t exist'}
    ${mockedParamsNewAppletWithoutActivityFlow} | ${mockedAppletData.activityFlows} | ${pathToActivityFlowsNewApplet} | ${'should redirect if applet is new and activity flow doesn\'t exist'}
  `('$description', ({ params, activityFlows, toBeCalledWith }) => {
    mockedUseParams.mockReturnValue(params);
    mockedGetValues.mockReturnValue(activityFlows);

    renderHook(useActivityFlowsRedirection);

    toBeCalledWith
      ? expect(mockedUseNavigate).toBeCalledWith(toBeCalledWith)
      : expect(mockedUseNavigate).not.toBeCalled();
  });
});
