import { renderHook } from '@testing-library/react';
import { v4 as uuidv4 } from 'uuid';

import { mockedAppletData } from 'shared/mock';

import { useCurrentActivity } from './useCurrentActivity';

const mockedExistingActivity = {
  activity: mockedAppletData.activities[0],
  fieldName: 'activities.0',
  activityObjField: 'activities[0]',
};
const mockedExistingKeydActivity = {
  activity: mockedAppletData.activities[1],
  fieldName: 'activities.1',
  activityObjField: 'activities[1]',
};

const mockedUseParams = vi.fn();
const mockedWatch = vi.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => mockedUseParams(),
}));
jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useFormContext: () => ({
    watch: () => mockedWatch(),
  }),
}));

describe('useCurrentActivity', () => {
  test.each`
    activityId                            | activities                     | expected                      | description
    ${undefined}                          | ${[]}                          | ${{}}                         | ${'returns empty object if there is no activityId in url'}
    ${uuidv4()}                           | ${mockedAppletData.activities} | ${{}}                         | ${"returns empty object if activity from url doesn't exist"}
    ${mockedAppletData.activities[0].id}  | ${undefined}                   | ${{}}                         | ${'returns empty object if there are no activities in form'}
    ${mockedAppletData.activities[0].id}  | ${mockedAppletData.activities} | ${mockedExistingActivity}     | ${'returns correct activity by id'}
    ${mockedAppletData.activities[1].key} | ${mockedAppletData.activities} | ${mockedExistingKeydActivity} | ${'returns correct activity by key'}
  `('$description', ({ activityId, activities, expected }) => {
    mockedUseParams.mockReturnValue({ activityId });
    mockedWatch.mockReturnValue(activities);

    const { result } = renderHook(useCurrentActivity);

    expect(result.current).toStrictEqual(expected);
  });
});
