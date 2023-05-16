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

export const enum ModalType {
  Upload = 'upload',
  Edit = 'edit',
  Delete = 'delete',
}

export type Steps = 0 | 1;
