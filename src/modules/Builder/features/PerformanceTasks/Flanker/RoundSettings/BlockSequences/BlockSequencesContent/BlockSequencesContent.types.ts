import { Dispatch, SetStateAction } from 'react';

export type UploadedTable = Record<string, string | number>[] | null;

export type SetUploadedTable = Dispatch<SetStateAction<UploadedTable>>;
