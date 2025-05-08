import {
  DecryptedActivityData,
  ExportDataResult,
  ExtendedExportAnswerWithoutEncryption,
} from 'shared/types/answer';
import { ExportDataFilters } from 'shared/utils/exportData/prepareData';
import { EncryptionParsed } from 'shared/utils/encryption/encryption.types';

type CommonMessageProps = {
  page: number;
  hasSuffix: boolean;
  filters?: ExportDataFilters;
};

export type WorkerPostMessageEvent = MessageEvent<
  CommonMessageProps & {
    encryptedData: ExportDataResult;
    encryptionInfoFromServer: EncryptionParsed | null;
    privateKey: number[] | null;
    shouldLogDataInDebugMode: boolean;
    ItemResponseType: Record<string, string>;
  }
>;

export type WorkerOnMessageEvent = MessageEvent<
  CommonMessageProps & {
    success: boolean;
    decryptedData: DecryptedActivityData<ExtendedExportAnswerWithoutEncryption>[];
    error: string;
  }
>;

export type GetDecryptedParsedAnswers = {
  exportDataResult: ExportDataResult;
  encryptionInfoFromServer: EncryptionParsed | null;
  privateKey: number[] | null;
  shouldLogDataInDebugMode: boolean;
  itemResponseTypeEnum: Record<string, string>;
};
