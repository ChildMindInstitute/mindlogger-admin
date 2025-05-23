import { ActivityFlowFormValues } from 'modules/Builder/types';

import { getSettings } from './ActivityFlowSettings.utils';

const mockActivityFlow = {
  id: '123',
  name: 'Test Activity Flow',
  description: 'Description 1',
  items: [{ activityKey: 'activity1' }],
};

vi.mock('modules/Builder/features/ReportConfigSetting', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-report-config-setting" />,
}));

const testReportConfigurationItem = (activityFlow: ActivityFlowFormValues) => {
  const isNewActivityFlow = !activityFlow?.id;
  const settings = getSettings(activityFlow);
  expect(settings).toHaveLength(1);

  const [reportsGroup] = settings;
  expect(reportsGroup.label).toBe('reports');

  const groupItems = reportsGroup.items;
  expect(groupItems).toHaveLength(1);

  const [reportConfiguration] = groupItems;
  expect(reportConfiguration.name).toBe('reportConfiguration');
  expect(reportConfiguration.label).toBe('Report Configuration');
  expect(reportConfiguration.param).toBe('report-configuration');

  expect(reportConfiguration.disabled).toEqual(isNewActivityFlow);
  expect(reportConfiguration.tooltip).toEqual(
    isNewActivityFlow ? 'saveAndPublishFirst' : undefined,
  );
  expect(reportConfiguration['data-testid']).toBe('builder-activity-flows-settings-report-config');
};

describe('getSettings', () => {
  test('returns settings with report configuration when activityFlow is provided', () => {
    testReportConfigurationItem(mockActivityFlow);
  });

  it('returns settings with disabled report configuration for a new activityFlow', () => {
    const { id, ...newActivityFlow } = mockActivityFlow;
    testReportConfigurationItem(newActivityFlow);
  });
});
