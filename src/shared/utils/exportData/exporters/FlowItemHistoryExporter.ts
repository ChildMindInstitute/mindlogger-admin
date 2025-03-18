import { DataExporter, DataExporterOptions } from 'shared/utils/exportData/exporters/DataExporter';
import { getFlowItemHistory } from 'modules/Dashboard/api';

type FlowItemHistoryRow = {
  applet_id: string;
  applet_version: string;
  flow_item_history_created_date: string;
  flow_id: string;
  flow_name: string;
  activity_id: string;
  activity_name: string;
};

/**
 * A helper class for exporting the history of each version of each activity within each version of each activity flow
 * inside a given applet, optionally constrained by a date range.
 */
export class FlowItemHistoryExporter extends DataExporter<FlowItemHistoryRow> {
  constructor(public appletId: string) {
    super('flow_item_history');
  }

  async exportData({ appletId, ...params }: DataExporterOptions): Promise<void> {
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
        flow_id: item.flowId,
        flow_name: item.flowName,
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
      'flow_id',
      'flow_name',
      'activity_id',
      'activity_name',
    ];
  }
}
