import { useEffect, useRef, useState } from 'react';

import { MultipleDecryptWorkersProps } from 'shared/features/AppletSettings/ExportDataSetting/Popups/DataExportPopup/DataExportPopup.types';
import { DataExportWorkersManager as DataExportWorkersManagerClass } from 'shared/features/AppletSettings/ExportDataSetting/Popups/DataExportPopup/DataExportWorkersManager';
import { useFeatureFlags } from 'shared/hooks';
import { ExportDataResult } from 'shared/types/answer';
import { checkIfShouldLogging } from 'shared/utils';
import { getParsedEncryptionFromServer } from 'shared/utils/encryption';

export const useMultipleDecryptWorkers = ({
  handleExportPopupClose,
  appletId,
  encryption,
  filters,
  privateKeyRef,
}: MultipleDecryptWorkersProps) => {
  const [dataIsExporting, setDataIsExporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [exportDataQueue, setExportDataQueue] = useState<ExportDataResult[] | null>(null);
  const limitRef = useRef(1);
  const finishedPagesRef = useRef<Set<number>>(new Set());
  const encryptionInfoFromServer = getParsedEncryptionFromServer(encryption);
  const { featureFlags } = useFeatureFlags();

  const shouldLogDataInDebugMode = checkIfShouldLogging();

  const DataExportWorkerManager = useRef(
    new DataExportWorkersManagerClass(
      encryptionInfoFromServer,
      privateKeyRef,
      filters,
      shouldLogDataInDebugMode,
      setDataIsExporting,
      handleExportPopupClose,
      appletId,
      setCurrentPage,
      limitRef,
      finishedPagesRef,
      featureFlags,
    ),
  ).current;

  useEffect(() => {
    if (!exportDataQueue) return;

    const processingBatch = exportDataQueue[currentPage - 1];

    if (processingBatch) {
      DataExportWorkerManager.processData(processingBatch, currentPage);
    }
  }, [exportDataQueue, currentPage, DataExportWorkerManager]);

  useEffect(
    () => () => {
      if (!DataExportWorkerManager) return;

      DataExportWorkerManager.terminateWorkers();
    },
    [DataExportWorkerManager],
  );

  return {
    dataIsExporting,
    setDataIsExporting,
    setExportDataQueue,
    limitRef,
    finishedPagesRef,
  };
};
