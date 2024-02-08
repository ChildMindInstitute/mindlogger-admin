import { renderHook } from '@testing-library/react';
import { generatePath } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { page } from 'resources';
import { mockedActivityId, mockedAppletData, mockedAppletId, mockedSingleSelectFormValues } from 'shared/mock';
import { Path } from 'shared/utils';

import { useRedirectIfNoMatchedActivityItem } from './useRedirectIfNoMatchedActivityItem';

const mockedItemId = mockedSingleSelectFormValues.id;
const mockedCommonParams = {
  appletId: mockedAppletId,
  activityId: mockedActivityId,
};
const mockedParamsWithActivityItem = {
  ...mockedCommonParams,
  itemId: mockedItemId,
};
const mockedParamsWithoutActivityItem = {
  ...mockedCommonParams,
  itemId: uuidv4(),
};
const mockedParamsNewAppletWithActivityItem = {
  ...mockedCommonParams,
  appletId: Path.NewApplet,
  itemId: mockedItemId,
};
const mockedParamsNewAppletWithoutActivityItem = {
  ...mockedCommonParams,
  appletId: Path.NewApplet,
  itemId: uuidv4(),
};
const pathToActivityItems = generatePath(page.builderAppletActivityItems, mockedCommonParams);
const pathToActivityItemsNewApplet = generatePath(page.builderAppletActivityItems, {
  ...mockedCommonParams,
  appletId: Path.NewApplet,
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

describe('useRedirectIfNoMatchedActivityItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test.each`
    params                                      | activityFlows                           | toBeCalledWith                  | description
    ${mockedParamsWithActivityItem}             | ${mockedAppletData.activities[0].items} | ${undefined}                    | ${"doesn't redirect if activity item exists"}
    ${mockedParamsNewAppletWithActivityItem}    | ${mockedAppletData.activities[0].items} | ${undefined}                    | ${"doesn't redirect if applet is new and activity item exists"}
    ${mockedParamsWithoutActivityItem}          | ${mockedAppletData.activities[0].items} | ${pathToActivityItems}          | ${"should redirect if activity item doesn't exist"}
    ${mockedParamsNewAppletWithoutActivityItem} | ${mockedAppletData.activities[0].items} | ${pathToActivityItemsNewApplet} | ${"should redirect if applet is new and activity item doesn't exist"}
  `('$description', ({ params, activityFlows, toBeCalledWith }) => {
    mockedUseParams.mockReturnValue(params);
    mockedGetValues.mockReturnValue(activityFlows);

    renderHook(useRedirectIfNoMatchedActivityItem);

    toBeCalledWith
      ? expect(mockedUseNavigate).toBeCalledWith(toBeCalledWith)
      : expect(mockedUseNavigate).not.toBeCalled();
  });
});
