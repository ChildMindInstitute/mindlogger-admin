import { generatePath } from 'react-router-dom';
import { renderHook } from '@testing-library/react';
import { v4 as uuidv4 } from 'uuid';
import { vi } from 'vitest';

import { mockedAppletData, mockedAppletId } from 'shared/mock';
import { page } from 'resources';
import { Path } from 'shared/utils';

import { useRedirectIfNoMatchedActivity } from './useRedirectIfNoMatchedActivity';
import { useCurrentActivity } from './useCurrentActivity';

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

vi.mock('./useCurrentActivity', () => ({
  useCurrentActivity: vi.fn(),
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

    // Set activity to undefined for cases where we expect a redirect
    // and to a mock value for cases where we don't expect a redirect
    vi.mocked(useCurrentActivity).mockReturnValue({
      activity: toBeCalledWith ? undefined : activities[0],
      fieldName: 'activities.0',
      activityObjField: 'activities[0]',
    });

    renderHook(useRedirectIfNoMatchedActivity);

    toBeCalledWith
      ? expect(mockedUseNavigate).toBeCalledWith(toBeCalledWith)
      : expect(mockedUseNavigate).not.toBeCalled();
  });
});
