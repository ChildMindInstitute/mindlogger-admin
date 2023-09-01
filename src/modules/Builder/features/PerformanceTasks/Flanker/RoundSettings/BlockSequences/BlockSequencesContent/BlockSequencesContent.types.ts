import { Dispatch, SetStateAction } from 'react';

import { IsPracticeRoundType } from '../../RoundSettings.types';

export type UploadedTable = Record<string, string | number>[] | null;

export type SetUploadedTable = Dispatch<SetStateAction<UploadedTable>>;

export type BlockSequencesContentProps = IsPracticeRoundType & {
  hasBlockSequencesErrors: boolean;
  'data-testid'?: string;
};
