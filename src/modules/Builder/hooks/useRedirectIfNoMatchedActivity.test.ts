import { generatePath } from 'react-router-dom';
import { renderHook } from '@testing-library/react';
import { v4 as uuidv4 } from 'uuid';

import { mockedAppletData, mockedAppletId } from 'shared/mock';
import { page } from 'resources';
import { Path } from 'shared/utils';

import { useRedirectIfNoMatchedActivity } from './useRedirectIfNoMatchedActivity';

const mockedParamsWithActivity = {
  appletId: mockedAppletId,
  activityId: mockedAppletData.activities[0].id,
};
const mockedParamsWithoutActivity = {
  appletId: mockedAppletId,
  activityId: uuidv4(),
};
const mockedParamsNewAppletWithActivity = {
  appletId: Path.NewApplet,
  activityId: mockedAppletData.activities[0].id,
};
const mockedParamsNewAppletWithoutActivity = {
  appletId: Path.NewApplet,
  activityId: uuidv4(),
};
const pathToActivities = generatePath(page.builderAppletActivities, {
  appletId: mockedParamsWithoutActivity.appletId,
});
const pathToActivitiesNewApplet = generatePath(page.builderAppletActivities, {
  appletId: mockedParamsNewAppletWithActivity.appletId,
});

const mockedUseNavigate = vi.fn();
const mockedUseParams = vi.fn();
const mockedGetValues = vi.fn();

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

describe('useRedirectIfNoMatchedActivity', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test.each`
    params                                  | activities                     | toBeCalledWith               | description
    ${mockedParamsWithActivity}             | ${mockedAppletData.activities} | ${undefined}                 | ${'doesnt redirect if activity exists'}
    ${mockedParamsNewAppletWithActivity}    | ${mockedAppletData.activities} | ${undefined}                 | ${'doesnt redirect if applet is new and activity exists'}
    ${mockedParamsWithoutActivity}          | ${mockedAppletData.activities} | ${pathToActivities}          | ${"should redirect if activity doesn't exist"}
    ${mockedParamsNewAppletWithoutActivity} | ${mockedAppletData.activities} | ${pathToActivitiesNewApplet} | ${"should redirect if applet is new and activity doesn't exist"}
  `('$description', ({ params, activities, toBeCalledWith }) => {
    mockedUseParams.mockReturnValue(params);
    mockedGetValues.mockReturnValue(activities);

    renderHook(useRedirectIfNoMatchedActivity);

    toBeCalledWith
      ? expect(mockedUseNavigate).toBeCalledWith(toBeCalledWith)
      : expect(mockedUseNavigate).not.toBeCalled();
  });
});
