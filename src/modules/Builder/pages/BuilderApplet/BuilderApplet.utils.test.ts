// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { PerfTaskType } from 'shared/consts';

import { getNewPerformanceTask } from './BuilderApplet.utils';

describe('getNewPerformanceTask', () => {
  test('auto-assigns a new performance task by default', () => {
    const task = getNewPerformanceTask({
      name: 'MERIT Task',
      description: '',
      performanceTaskType: PerfTaskType.Unity,
    });

    expect(task.autoAssign).toBe(true);
  });

  test('keeps the autoAssign value of a duplicated performance task', () => {
    const task = getNewPerformanceTask({
      name: 'MERIT Task (1)',
      description: '',
      performanceTask: { autoAssign: false, items: [] },
      performanceTaskType: PerfTaskType.Unity,
    });

    expect(task.autoAssign).toBe(false);
  });
});
