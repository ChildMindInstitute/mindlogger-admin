import { Dispatch, SetStateAction } from 'react';

import { IsPracticeRoundType } from '../../RoundSettings.types';

export type UploadedRecord = Record<string, { id: string; text: string }>;
export type UploadedData = UploadedRecord[];
export type UploadedDataOrNull = UploadedData | null;

export type UploadedTable = {
  data: UploadedDataOrNull;
  isInitial: boolean;
} | null;

export type SetUploadedTable = Dispatch<SetStateAction<UploadedTable>>;

export type BlockSequencesContentProps = IsPracticeRoundType & {
  hasBlockSequencesErrors: boolean;
  'data-testid'?: string;
};
