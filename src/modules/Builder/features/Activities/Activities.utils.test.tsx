import { Svg } from 'shared/components';
import { page } from 'resources';

import { getActivityKey, getActions, getPerformanceTaskPath } from './Activities.utils';
import { EditablePerformanceTasksType } from './Activities.types';

describe('getActivityKey', () => {
  test('should return entity key if it exists', () => {
    const entity = { name: '', description: '', items: [], key: 'activityKey', id: 'activityId' };
    const result = getActivityKey(entity);
    expect(result).toBe('activityKey');
  });

  test('should return entity id if key does not exist', () => {
    const entity = { name: '', description: '', items: [], id: 'activityId' };
    const result = getActivityKey(entity);
    expect(result).toBe('activityId');
  });

  test('should return empty string if both key and id do not exist', () => {
    const entity = { name: '', description: '', items: [] };
    const result = getActivityKey(entity);
    expect(result).toBe('');
  });
});

describe('getActions', () => {
  test('should return an array of actions with edit icon if isEditVisible is true', () => {
    const actions = getActions({
      key: 'key1',
      isActivityHidden: false,
      onEdit: vi.fn(),
      onDuplicate: vi.fn(),
      onVisibilityChange: vi.fn(),
      onRemove: vi.fn(),
      isEditVisible: true,
      'data-testid': 'test-id',
    });

    expect(actions).toEqual([
      {
        icon: <Svg id="edit" />,
        action: expect.any(Function),
        'data-testid': 'test-id-edit',
      },
      {
        icon: <Svg id="duplicate" />,
        action: expect.any(Function),
        'data-testid': 'test-id-duplicate',
      },
      {
        icon: <Svg id="visibility-on" />,
        action: expect.any(Function),
        isStatic: false,
        'data-testid': 'test-id-hide',
      },
      {
        icon: <Svg id="trash" />,
        action: expect.any(Function),
        'data-testid': 'test-id-remove',
      },
    ]);
  });

  test('should return an array of actions without edit icon if isEditVisible is false', () => {
    const actions = getActions({
      key: 'key1',
      isActivityHidden: false,
      onEdit: vi.fn(),
      onDuplicate: vi.fn(),
      onVisibilityChange: vi.fn(),
      onRemove: vi.fn(),
      isEditVisible: false,
      'data-testid': 'test-id',
    });

    expect(actions).toEqual([
      {
        icon: <Svg id="duplicate" />,
        action: expect.any(Function),
        'data-testid': 'test-id-duplicate',
      },
      {
        icon: <Svg id="visibility-on" />,
        action: expect.any(Function),
        isStatic: false,
        'data-testid': 'test-id-hide',
      },
      {
        icon: <Svg id="trash" />,
        action: expect.any(Function),
        'data-testid': 'test-id-remove',
      },
    ]);
  });
});

describe('getPerformanceTaskPath', () => {
  test.each`
    performanceTask                           | expected
    ${EditablePerformanceTasksType.Flanker}   | ${page.builderAppletFlanker}
    ${EditablePerformanceTasksType.Gyroscope} | ${page.builderAppletGyroscope}
    ${EditablePerformanceTasksType.Touch}     | ${page.builderAppletTouch}
    ${EditablePerformanceTasksType.Unity}     | ${page.builderAppletUnity}
  `('performanceTask = $performanceTask', ({ performanceTask, expected }) => {
    const result = getPerformanceTaskPath(performanceTask);
    expect(result).toBe(expected);
  });
});
