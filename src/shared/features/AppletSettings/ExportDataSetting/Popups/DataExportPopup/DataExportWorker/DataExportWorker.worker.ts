import { getDecryptedParsedAnswers } from 'shared/features/AppletSettings/ExportDataSetting/Popups/DataExportPopup/DataExportWorker/DataExportWorker.utils';
import { WorkerPostMessageEvent } from 'shared/features/AppletSettings/ExportDataSetting/Popups/DataExportPopup/DataExportWorker/DataExportWorker.types';

declare const self: DedicatedWorkerGlobalScope;
export default {} as typeof Worker & { new (): Worker };

self.addEventListener('message', async (event: WorkerPostMessageEvent): Promise<void> => {
  const {
    encryptedData,
    encryptionInfoFromServer,
    page,
    privateKey,
    hasSuffix,
    filters,
    shouldLogDataInDebugMode,
    ItemResponseType,
  } = event.data;

  try {
    const decryptedData = await getDecryptedParsedAnswers({
      exportDataResult: encryptedData,
      encryptionInfoFromServer,
      privateKey,
      shouldLogDataInDebugMode,
      itemResponseTypeEnum: ItemResponseType,
    });

    self.postMessage({ success: true, decryptedData, page, hasSuffix, filters });
  } catch (error) {
    self.postMessage({ success: false, error: (error as Error).message });
  }
});
