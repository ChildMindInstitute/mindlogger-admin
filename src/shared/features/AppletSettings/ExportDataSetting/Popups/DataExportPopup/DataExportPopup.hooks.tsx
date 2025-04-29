import { useEffect, useRef, useState } from 'react';

import { getParsedEncryptionFromServer } from 'shared/utils/encryption';
import { ExportDataResult } from 'shared/types/answer';
import { isProduction } from 'shared/utils/env';
import { SessionStorageKeys } from 'shared/utils/storage';
import { useFeatureFlags } from 'shared/hooks';

import { MultipleDecryptWorkersProps } from 'shared/features/AppletSettings/ExportDataSetting/Popups/DataExportPopup/DataExportPopup.types';
import { DataExportWorkersManager as DataExportWorkersManagerClass } from 'shared/features/AppletSettings/ExportDataSetting/Popups/DataExportPopup/DataExportWorkersManager';

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

  const shouldLogDataInDebugMode =
    !isProduction && sessionStorage.getItem(SessionStorageKeys.DebugMode) === 'true';

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
