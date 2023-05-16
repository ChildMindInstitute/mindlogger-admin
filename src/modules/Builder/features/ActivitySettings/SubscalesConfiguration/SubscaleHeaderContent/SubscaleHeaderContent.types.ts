export type SubscaleHeaderContentProps = {
  onRemove: () => void;
  name: string;
  title: string;
  open: boolean;
  onUpdate: (lookupTableData?: string) => void;
};
