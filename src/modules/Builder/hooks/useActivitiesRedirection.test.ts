import { generatePath } from 'react-router-dom';
import { renderHook } from '@testing-library/react';
import { v4 as uuidv4 } from 'uuid';

import { mockedAppletData, mockedAppletId } from 'shared/mock';
import { page } from 'resources';
import { Path } from 'shared/utils';

import { useActivitiesRedirection } from './useActivitiesRedirection';

const mockedAppletIdParams = {
  appletId: mockedAppletId,
};
const mockedParamsWithExistingActivity = {
  ...mockedAppletIdParams,
  activityId: mockedAppletData.activities[0].id,
};
const mockedParamsWithoutActivity = {
  ...mockedAppletIdParams,
  activityId: uuidv4(),
};
const mockedParamsNewApplet = {
  appletId: Path.NewApplet,
  activityId: uuidv4(),
};
const pathToActivities = generatePath(page.builderAppletActivities, {
  appletId: mockedParamsWithoutActivity.appletId,
});
const pathToActivitiesNewApplet = generatePath(page.builderAppletActivities, {
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

describe('useActivitiesRedirection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test.each`
    params                              | activities                     | toBeCalledWith               | description
    ${mockedParamsWithExistingActivity} | ${mockedAppletData.activities} | ${undefined}                 | ${'doesnt redirect if activity exists'}
    ${mockedParamsWithoutActivity}      | ${mockedAppletData.activities} | ${pathToActivities}          | ${'should redirect if activity doesn\'t exist'}
    ${mockedParamsNewApplet}            | ${[]}                          | ${pathToActivitiesNewApplet} | ${'should redirect if applet is new and there are no activities'}
  `('$description', ({ params, activities, toBeCalledWith }) => {
    mockedUseParams.mockReturnValue(params);
    mockedGetValues.mockReturnValue(activities);

    renderHook(useActivitiesRedirection);

    toBeCalledWith
      ? expect(mockedUseNavigate).toBeCalledWith(toBeCalledWith)
      : expect(mockedUseNavigate).not.toBeCalled();
  });
});
