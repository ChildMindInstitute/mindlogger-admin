import { useCallback, useEffect, useRef, useState } from 'react';

import { exportDecryptedDataSucceed } from 'shared/utils/exportData';
import { Mixpanel } from 'shared/utils/mixpanel/mixpanel';
import { getParsedEncryptionFromServer } from 'shared/utils/encryption';
import { ExportDataResult } from 'shared/types/answer';
import { useEncryptionStorage } from 'shared/hooks/useEncryptionStorage';
import { isProduction } from 'shared/utils/env';
import { SessionStorageKeys } from 'shared/utils/storage';
import { ItemResponseType } from 'shared/consts';

import { IdleWorker, MultipleDecryptWorkersProps } from './DataExportPopup.types';
import { WorkerOnMessageEvent } from './DataExportWorker/DataExportWorker.types';
import DecryptionWorker from './DataExportWorker/DataExportWorker.worker';
import { getExportDataSuffix } from './DataExportPopup.utils';
import { NUM_WORKERS } from './DataExportWorker/DataExportWorker.const';

export const useMultipleDecryptWorkers = ({
  handleExportPopupClose,
  appletId,
  encryption,
  filters,
}: MultipleDecryptWorkersProps) => {
  const [dataIsExporting, setDataIsExporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [exportDataQueue, setExportDataQueue] = useState<ExportDataResult[] | null>(null);

  const dataExportingApiRef = useRef(false);
  const workersRef = useRef<IdleWorker[]>([]);
  const processedPagesRef = useRef<Set<number>>(new Set());
  const finishedPagesRef = useRef<Set<number>>(new Set());
  const limitRef = useRef(1);
  const taskQueueRef = useRef<{ pageData: ExportDataResult; page: number }[]>([]);
  const shouldLogDataInDebugMode =
    !isProduction && sessionStorage.getItem(SessionStorageKeys.DebugMode) === 'true';

  const { getAppletPrivateKey } = useEncryptionStorage();

  const encryptionInfoFromServer = getParsedEncryptionFromServer(encryption);
  const privateKey = getAppletPrivateKey(appletId) as number[];

  const distributeTasks = useCallback(() => {
    workersRef.current.forEach((worker) => {
      if (worker.isIdle && taskQueueRef.current.length > 0) {
        const currentTask = taskQueueRef.current.shift();
        if (!currentTask) return;

        const { pageData, page } = currentTask;
        worker.isIdle = false;
        worker.postMessage({
          encryptedData: pageData,
          encryptionInfoFromServer,
          page,
          privateKey,
          hasSuffix: limitRef.current > 1,
          filters,
          shouldLogDataInDebugMode,
          ItemResponseType,
        });

        setCurrentPage((prevState) => prevState + 1);
      }
    });
  }, [encryptionInfoFromServer, privateKey, filters, shouldLogDataInDebugMode]);

  const processData = useCallback(
    (pageData: ExportDataResult, page: number) => {
      if (workersRef.current.length === 0 || processedPagesRef.current.has(page)) return;

      taskQueueRef.current.push({ pageData, page });
      distributeTasks();
    },
    [distributeTasks],
  );

  const handleAllTasksCompleted = () => {
    // check if all pages are processed and all workers are idle
    const allPagesProcessed =
      processedPagesRef.current.size === limitRef.current &&
      finishedPagesRef.current.size === limitRef.current;
    const allWorkersIdle = workersRef.current.every((worker) => worker.isIdle);

    if (!dataExportingApiRef.current && allPagesProcessed && allWorkersIdle) {
      setDataIsExporting(false);
      handleExportPopupClose();
      Mixpanel.track('Export Data Successful', {
        'Applet ID': appletId,
      });
    }
  };

  useEffect(() => {
    if (!exportDataQueue) return;

    const processingBatch = exportDataQueue[currentPage - 1];

    if (processingBatch) {
      processData(processingBatch, currentPage);
    }
  }, [exportDataQueue, currentPage, processData]);

  useEffect(() => {
    const workers: IdleWorker[] = Array.from({ length: NUM_WORKERS }, () => {
      const worker = new DecryptionWorker() as IdleWorker;
      worker.isIdle = true;
      worker.onmessage = async (event: WorkerOnMessageEvent) => {
        const { success, decryptedData, error, page, hasSuffix, filters } = event.data;
        worker.isIdle = true;
        processedPagesRef.current.add(page);

        if (success) {
          await exportDecryptedDataSucceed({
            suffix: hasSuffix ? getExportDataSuffix(page) : '',
            filters,
          })(decryptedData);

          finishedPagesRef.current.add(page);
          handleAllTasksCompleted();
        } else {
          console.error('Decryption failed:', error);
        }

        distributeTasks();
      };

      return worker;
    });

    workersRef.current = workers;

    return () => {
      workers.forEach((worker) => worker.terminate());
    };
    // create workers only once when the component mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    dataIsExporting,
    setDataIsExporting,
    setExportDataQueue,
    dataExportingApiRef,
    limitRef,
    finishedPagesRef,
  };
};
