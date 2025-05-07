import { AxiosResponse } from 'axios';

import { FlowActivityHistoryExporter } from 'shared/utils/exportData/exporters/FlowActivityHistoryExporter';
import * as api from 'modules/Dashboard/api';
import { FlowItemHistoryData } from 'modules/Dashboard/api';

jest.mock('modules/Dashboard/api', () => ({
  ...jest.requireActual('modules/Dashboard/api'),
  getFlowItemHistory: jest.fn(),
}));

const mockGetFlowItemHistory = jest.spyOn(api, 'getFlowItemHistory');

describe('FlowActivityHistoryExporter', () => {
  const exporter = new FlowActivityHistoryExporter('applet-id');

  beforeEach(() => {
    mockGetFlowItemHistory.mockImplementation(
      async () =>
        ({
          data: { result: [] },
        }) as AxiosResponse,
    );
    mockGetFlowItemHistory.mockClear();
  });

  describe('getCSVHeaders', () => {
    it('returns the correct headers', () => {
      expect(exporter.getCSVHeaders()).toEqual([
        'applet_id',
        'applet_version',
        'flow_activity_history_created_date',
        'activity_flow_id',
        'activity_flow_name',
        'activity_id',
        'activity_name',
      ]);
    });
  });

  describe('exportData', () => {
    it('calls getFlowItemHistory to download data', async () => {
      await exporter.exportData({ appletId: 'applet-id' });

      const mockGetFlowItemHistory = jest.spyOn(api, 'getFlowItemHistory');

      expect(mockGetFlowItemHistory).toHaveBeenCalledWith(
        expect.objectContaining({
          appletId: 'applet-id',
        }),
      );
    });

    it('Does not download file when there is no data', async () => {
      const downloadAsCSVSpy = jest.spyOn(exporter, 'downloadAsCSV');

      await exporter.exportData({ appletId: 'applet-id' });

      expect(downloadAsCSVSpy).not.toHaveBeenCalled();
    });

    it('Sorts in descending order by applet version and created date', async () => {
      const appletId = 'applet-id';
      const appletName = 'applet-name';
      const activityId = 'activity-id';
      const activityName = 'activity-name';
      const flowId = 'flow-id';
      const flowName = 'flow-name';

      const commonData = {
        appletId,
        appletName,
        activityId,
        activityName,
        flowId,
        flowName,
      };

      const flowHistoryData: FlowItemHistoryData[] = [
        {
          ...commonData,
          appletVersion: '1.1.0',
          createdAt: '2025-05-07T09:00:00',
        },
        {
          ...commonData,
          appletVersion: '1.1.1',
          createdAt: '2025-05-07T09:01:00',
        },
        {
          ...commonData,
          appletVersion: '1.1.2',
          createdAt: '2025-05-07T09:02:00',
        },
        {
          ...commonData,
          appletVersion: '1.1.3',
          createdAt: '2025-05-07T09:03:00',
        },
        {
          ...commonData,
          appletVersion: '1.1.4',
          createdAt: '2025-05-07T09:04:00',
        },
        {
          ...commonData,
          appletVersion: '1.1.5',
          createdAt: '2025-05-07T09:05:00',
        },
        {
          ...commonData,
          appletVersion: '1.1.6',
          createdAt: '2025-05-07T09:06:00',
        },
        {
          ...commonData,
          appletVersion: '1.1.7',
          createdAt: '2025-05-07T09:07:00',
        },
        {
          ...commonData,
          appletVersion: '1.1.8',
          createdAt: '2025-05-07T09:08:00',
        },
        {
          ...commonData,
          appletVersion: '1.1.9',
          createdAt: '2025-05-07T09:09:00',
        },
        {
          ...commonData,
          appletVersion: '1.1.10',
          createdAt: '2025-05-07T09:10:00',
        },
        {
          ...commonData,
          appletVersion: '1.1.10',
          createdAt: '2025-05-07T09:11:00',
        },
        {
          ...commonData,
          appletVersion: '1.1.11',
          createdAt: '2025-05-07T09:12:00',
        },
      ];

      mockGetFlowItemHistory.mockImplementation(
        async () =>
          ({
            data: {
              result: flowHistoryData,
            },
          }) as AxiosResponse,
      );

      const downloadAsCSVSpy = jest.spyOn(exporter, 'downloadAsCSV');
      downloadAsCSVSpy.mockImplementation(async () => {});

      await exporter.exportData({ appletId });

      const commonExportedData = {
        applet_id: appletId,
        activity_flow_id: flowId,
        activity_flow_name: flowName,
        activity_id: activityId,
        activity_name: activityName,
      };

      expect(downloadAsCSVSpy).toHaveBeenCalledWith([
        {
          ...commonExportedData,
          applet_version: '1.1.11',
          flow_activity_history_created_date: '2025-05-07T09:12:00',
        },
        {
          ...commonExportedData,
          applet_version: '1.1.10',
          flow_activity_history_created_date: '2025-05-07T09:11:00',
        },
        {
          ...commonExportedData,
          applet_version: '1.1.10',
          flow_activity_history_created_date: '2025-05-07T09:10:00',
        },
        {
          ...commonExportedData,
          applet_version: '1.1.9',
          flow_activity_history_created_date: '2025-05-07T09:09:00',
        },
        {
          ...commonExportedData,
          applet_version: '1.1.8',
          flow_activity_history_created_date: '2025-05-07T09:08:00',
        },
        {
          ...commonExportedData,
          applet_version: '1.1.7',
          flow_activity_history_created_date: '2025-05-07T09:07:00',
        },
        {
          ...commonExportedData,
          applet_version: '1.1.6',
          flow_activity_history_created_date: '2025-05-07T09:06:00',
        },
        {
          ...commonExportedData,
          applet_version: '1.1.5',
          flow_activity_history_created_date: '2025-05-07T09:05:00',
        },
        {
          ...commonExportedData,
          applet_version: '1.1.4',
          flow_activity_history_created_date: '2025-05-07T09:04:00',
        },
        {
          ...commonExportedData,
          applet_version: '1.1.3',
          flow_activity_history_created_date: '2025-05-07T09:03:00',
        },
        {
          ...commonExportedData,
          applet_version: '1.1.2',
          flow_activity_history_created_date: '2025-05-07T09:02:00',
        },
        {
          ...commonExportedData,
          applet_version: '1.1.1',
          flow_activity_history_created_date: '2025-05-07T09:01:00',
        },
        {
          ...commonExportedData,
          applet_version: '1.1.0',
          flow_activity_history_created_date: '2025-05-07T09:00:00',
        },
      ]);
    });
  });
});
