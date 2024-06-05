import { renderHook } from '@testing-library/react';
import { useParams, useNavigate } from 'react-router-dom';
import { isValidElement } from 'react';

import { mockedAppletFormData } from 'shared/mock';
import { Activity } from 'redux/modules';

import { useActivityGrid } from './ActivityGrid.hooks';

const { activities: appletActivities } = mockedAppletFormData;
const mockedActivities = appletActivities as Activity[];
const mockedActivitiesData = {
  result: mockedActivities,
  count: mockedActivities.length,
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

const mockedUseParams = useParams as jest.MockedFunction<typeof useParams>;
const mockedUseNavigate = useNavigate as jest.MockedFunction<typeof useNavigate>;

jest.mock('redux/store/hooks', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

describe('useActivityGrid', () => {
  beforeEach(() => {
    mockedUseParams.mockReset();
    mockedUseNavigate.mockReset();

    mockedUseParams.mockReturnValue({ appletId: mockedAppletFormData.id });
  });

  test('should return correct default actions', () => {
    const {
      result: {
        current: { actions },
      },
    } = renderHook(() => useActivityGrid('test', mockedActivitiesData));

    expect(actions).toMatchObject({
      editActivity: expect.any(Function),
      exportData: expect.any(Function),
      assignActivity: expect.any(Function),
      takeNow: expect.any(Function),
    });
  });

  test('formatRow should return correct values', () => {
    const {
      result: {
        current: { formatRow },
      },
    } = renderHook(() => useActivityGrid('test', mockedActivitiesData));

    const activity = mockedActivities[0];
    const row = formatRow(activity);

    expect(row).toMatchObject({
      image: {
        content: expect.any(Function),
        value: '',
      },
      name: {
        content: expect.any(Function),
        value: activity.name,
      },
      participantCount: {
        content: expect.any(Function),
        value: 0, // Number(null) === 0
      },
      latestActivity: {
        content: expect.any(Function),
        value: 'null',
      },
      compliance: {
        content: expect.any(Function),
        value: 0, // Number(null) === 0
      },
      actions: {
        content: expect.any(Function),
        value: '',
      },
    });

    expect(row.image.content?.()).toEqual('');
    expect(row.name.content?.()).toEqual(activity.name);
    expect(row.participantCount.content?.()).toBeNull();
    expect(row.latestActivity.content?.()).toEqual(false);
    expect(row.compliance.content?.()).toEqual(false);
    expect(isValidElement(row.actions.content?.())).toEqual(true);
  });

  test('getActivityById should return correct activity', () => {
    const {
      result: {
        current: { getActivityById },
      },
    } = renderHook(() => useActivityGrid('test', mockedActivitiesData));

    const activity = mockedActivities[0];
    expect(getActivityById(String(activity.id))).toEqual(activity);
    expect(getActivityById('invalid-id')).toBeNull();
  });

  test('editActivity should navigate to correct the activity builder page', () => {
    const mockedNavigate = jest.fn();
    mockedUseNavigate.mockReturnValue(mockedNavigate);

    const {
      result: {
        current: {
          actions: { editActivity },
        },
      },
    } = renderHook(() => useActivityGrid('test', mockedActivitiesData));

    const activity = mockedActivities[0];
    editActivity({
      context: { appletId: mockedAppletFormData.id, activityId: String(activity.id) },
    });

    expect(mockedNavigate).toHaveBeenCalledWith(
      `/builder/${mockedAppletFormData.id}/activities/${activity.id}`,
    );
  });
});
