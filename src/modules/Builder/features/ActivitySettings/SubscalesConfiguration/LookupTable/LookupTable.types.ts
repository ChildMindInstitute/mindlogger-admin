import { Schema } from 'yup';

import { DataTableItem, FileUploaderProps, ImportedFile, ModalProps } from 'shared/components';

export type LookupTableProps = {
  open: boolean;
  labelsObject: LabelsObject;
  columnData: { key: string; label: string }[];
  tableData?: DataTableItem[];
  template: Record<string, string | number | undefined>[];
  templatePrefix?: string;
  schema: Schema;
  onClose: () => void;
  onUpdate: (lookupTableData?: DataTableItem[]) => void;
  'data-testid'?: string;
};

export type LookupTableSetupHookProps = {
  errors: LabelsObject['errors'];
  template: LookupTableProps['template'];
  templatePrefix: LookupTableProps['templatePrefix'];
  tableData?: DataTableItem[];
  schema: LookupTableProps['schema'];
};

export type LabelsObject = {
  [key in ModalType]: {
    title: string;
    initDescription: JSX.Element;
    successDescription?: JSX.Element;
  };
} & {
  errors: {
    haveToUploadFile: JSX.Element;
    incorrectFileFormat: JSX.Element;
    fileCantBeParsed: JSX.Element;
    onDelete: JSX.Element | string;
  };
};

export type GetComponentsProps = {
  modalType: ModalType;
  columnData: LookupTableProps['columnData'];
  data?: DataTableItem[];
  error: JSX.Element | null;
  labelsObject: LabelsObject;
  onFileReady: (file: ImportedFile | null) => void;
  onDownloadTemplate: FileUploaderProps['onDownloadTemplate'];
  onUpdate: LookupTableProps['onUpdate'];
  onClose: LookupTableProps['onClose'];
  setModalType: (value: ModalType) => void;
  setStep: (value: Steps) => void;
  setError: (value: JSX.Element | null) => void;
};

export type ScreenObjectProps = Record<
  ModalType,
  (Pick<
    ModalProps,
    | 'title'
    | 'buttonText'
    | 'submitBtnColor'
    | 'onSubmit'
    | 'hasSecondBtn'
    | 'secondBtnText'
    | 'onSecondBtnSubmit'
    | 'hasThirdBtn'
    | 'thirdBtnText'
    | 'onThirdBtnSubmit'
  > & { component: JSX.Element })[]
>;

export const enum ModalType {
  Upload = 'upload',
  Edit = 'edit',
  Delete = 'delete',
}

export type Steps = 0 | 1;

export const TScoreSeverity = ['Minimal', 'Mild', 'Moderate', 'Severe', ''] as const;

export type TScoreSeverity = (typeof TScoreSeverity)[number];

export type LookupTableDataItem = DataTableItem & {
  score?: string;
  rawScore: string;
  optionalText: string;
  severity?: TScoreSeverity | null;
  age?: string | number | null;
  sex?: string | null;
  id: string;
};
