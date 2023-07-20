import {
  DataTableItem,
  FileUploaderProps,
  FileUploaderRefProps,
  ImportedFile,
  ModalProps,
} from 'shared/components';
import { MutableRefObject } from 'react';

export type LookupTableProps = {
  open: boolean;
  labelsObject: LabelsObject;
  columnData: { key: string; label: string }[];
  tableData?: DataTableItem[];
  template: Record<string, string | number | undefined>[];
  templatePrefix?: string;
  parsingRules?: {
    mandatory: boolean;
    key: string;
  }[];
  onClose: () => void;
  onUpdate: (lookupTableData?: DataTableItem[]) => void;
};

export type LookupTableSetupHookProps = {
  template: LookupTableProps['template'];
  templatePrefix: LookupTableProps['templatePrefix'];
  tableData?: DataTableItem[];
  labelsObject: LookupTableProps['labelsObject'];
  parsingRules: LookupTableProps['parsingRules'];
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
  fileUploaderRef?: MutableRefObject<FileUploaderRefProps | null>;
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
