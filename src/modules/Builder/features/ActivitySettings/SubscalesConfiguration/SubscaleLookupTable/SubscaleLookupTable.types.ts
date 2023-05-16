import { DataTableItem, FileUploaderProps, ImportedFile, ModalProps } from 'shared/components';

export type SubscaleLookupTableProps = {
  open: boolean;
  subscaleName: string;
  tableData?: string;
  onClose: () => void;
  onUpdate: (lookupTableData?: string) => void;
};

export type SubscaleLookupTableSetupHookProps = {
  tableData?: string;
};

export type GetComponentsProps = {
  modalType: ModalType;
  subscaleName: string;
  data?: DataTableItem[];
  error: JSX.Element | null;
  onFileReady: (file: ImportedFile | null) => void;
  onDownloadTemplate: FileUploaderProps['onDownloadTemplate'];
  onUpdate: (data?: string) => void;
  onClose: () => void;
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
