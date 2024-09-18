import { getExportDataApi } from 'modules/Dashboard/api';
import { sendLogFile } from 'shared/utils/logger';

import { ExportDataProps } from '../DataExportPopup.types';

export class ExportDataFetchService {
  private abortController: AbortController | null = null;

  public executeExport = async (body: ExportDataProps) => {
    this.abortController = new AbortController();

    try {
      return await getExportDataApi(body, this.abortController.signal);
    } catch (e) {
      const error = e as TypeError;
      console.warn('Error while downloading export data', error);
      await sendLogFile({ error });

      throw error;
    }
  };

  public cancelExport = () => {
    if (this.abortController) {
      this.abortController.abort();
    }
  };
}
