import { Dispatch, MutableRefObject, SetStateAction } from 'react';

import { ExportDataResult } from 'shared/types/answer';
import { EncryptionParsed } from 'shared/utils/encryption';
import { ExportDataFilters, exportDecryptedDataSucceed } from 'shared/utils/exportData';
import { ItemResponseType } from 'shared/consts';
import { Mixpanel } from 'shared/utils/mixpanel/mixpanel';
import { MixpanelEventType, MixpanelProps } from 'shared/utils/mixpanel/mixpanel.types';

import DecryptionWorker from '../DataExportWorker/DataExportWorker.worker';
import { IdleWorker } from '../DataExportPopup.types';
import { NUM_WORKERS } from '../DataExportWorker/DataExportWorker.const';
import { WorkerOnMessageEvent } from '../DataExportWorker/DataExportWorker.types';
import { getExportDataSuffix } from '../DataExportPopup.utils';

export class DataExportWorkersManager {
  private workers: IdleWorker[] = [];
  private processedPages = new Set<number>();
  private taskQueue: Array<{ pageData: ExportDataResult; page: number }> = [];

  constructor(
    private encryptionInfoFromServer: EncryptionParsed | null,
    private privateKeyRef: MutableRefObject<number[] | null>,
    private filters: ExportDataFilters | undefined,
    private shouldLogDataInDebugMode: boolean,
    private setDataIsExporting: Dispatch<SetStateAction<boolean>>,
    private handleExportPopupClose: () => void,
    private appletId: string,
    private setCurrentPage: Dispatch<SetStateAction<number>>,
    private limitRef: MutableRefObject<number>,
    private finishedPagesRef: MutableRefObject<Set<number>>,
    private enableDataExportRenaming: boolean,
  ) {
    this.initializeWorkers();
  }

  private initializeWorkers = () => {
    this.workers = Array.from({ length: NUM_WORKERS }, () => {
      const worker = new DecryptionWorker() as IdleWorker;
      worker.isIdle = true;
      worker.onmessage = (event: WorkerOnMessageEvent) => this.handleWorkerMessage(worker, event);

      return worker;
    });
  };

  private handleAllTasksCompleted = () => {
    const allPagesProcessed =
      this.processedPages.size === this.limitRef.current &&
      this.finishedPagesRef.current.size === this.limitRef.current;
    const allWorkersIdle = this.workers.every((worker) => worker.isIdle);

    if (allPagesProcessed && allWorkersIdle) {
      this.setDataIsExporting(false);
      this.handleExportPopupClose();
      Mixpanel.track({
        action: MixpanelEventType.ExportDataSuccessful,
        [MixpanelProps.AppletId]: this.appletId,
      });
    }
  };

  private handleWorkerMessage = (worker: IdleWorker, event: WorkerOnMessageEvent) => {
    const { success, decryptedData, error, page, hasSuffix, filters } = event.data;
    worker.isIdle = true;
    this.processedPages.add(page);

    if (success) {
      exportDecryptedDataSucceed({
        suffix: hasSuffix ? getExportDataSuffix(page) : '',
        filters,
        enableDataExportRenaming: this.enableDataExportRenaming,
      })(decryptedData).then(() => {
        this.finishedPagesRef.current.add(page);
        this.handleAllTasksCompleted();
      });
    } else {
      console.error('Decryption failed:', error);
    }

    this.distributeTasks();
  };

  private distributeTasks = () => {
    this.workers.forEach((worker) => {
      if (worker.isIdle && this.taskQueue.length > 0) {
        const currentTask = this.taskQueue.shift();
        if (!currentTask) return;

        const { pageData, page } = currentTask;
        worker.isIdle = false;
        worker.postMessage({
          encryptedData: pageData,
          encryptionInfoFromServer: this.encryptionInfoFromServer,
          page,
          privateKey: this.privateKeyRef.current,
          hasSuffix: this.limitRef.current > 1,
          filters: this.filters,
          shouldLogDataInDebugMode: this.shouldLogDataInDebugMode,
          ItemResponseType,
        });

        this.setCurrentPage((prevState) => prevState + 1);
      }
    });
  };

  public processData = (pageData: ExportDataResult, page: number) => {
    if (this.workers.length === 0 || this.processedPages.has(page)) return;

    this.taskQueue.push({ pageData, page });
    this.distributeTasks();
  };

  public terminateWorkers = () => {
    this.workers.forEach((worker) => worker.terminate());
  };
}
