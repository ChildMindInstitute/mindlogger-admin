import { DataExporter, DataExporterOptions } from 'shared/utils/exportData/exporters/DataExporter';
import { getFlowItemHistory } from 'modules/Dashboard/api';

type FlowActivityHistoryRow = {
  applet_id: string;
  applet_version: string;
  flow_item_history_created_date: string;
  activity_flow_id: string;
  activity_flow_name: string;
  activity_id: string;
  activity_name: string;
};

type FlowActivityHistoryExporterOptions = DataExporterOptions & {
  /**
   * Export history for only those activity flows with these IDs
   */
  flowIds?: string[];
};

/**
 * A helper class for exporting the history of each version of each activity within each version of each activity flow
 * inside a given applet, optionally constrained by a date range.
 */
export class FlowActivityHistoryExporter extends DataExporter<FlowActivityHistoryRow> {
  constructor(public appletId: string) {
    super('flow_activity_history');
  }

  async exportData({ appletId, ...params }: FlowActivityHistoryExporterOptions): Promise<void> {
    const flowItemHistory = await this.requestAllPagesConcurrently(
      (page) => getFlowItemHistory({ appletId, ...params, page }),
      5,
    );

    if (flowItemHistory.length === 0) {
      // Nothing to export
      return;
    }

    await this.downloadAsCSV(
      flowItemHistory.map((item) => ({
        applet_id: item.appletId,
        applet_version: item.appletVersion,
        flow_item_history_created_date: item.createdAt,
        activity_flow_id: item.flowId,
        activity_flow_name: item.flowName,
        activity_id: item.activityId,
        activity_name: item.activityName,
      })),
    );
  }

  getCSVHeaders(): string[] {
    return [
      'applet_id',
      'applet_version',
      'flow_item_history_created_date',
      'activity_flow_id',
      'activity_flow_name',
      'activity_id',
      'activity_name',
    ];
  }
}
