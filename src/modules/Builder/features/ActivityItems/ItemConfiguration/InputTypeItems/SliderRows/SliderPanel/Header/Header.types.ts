export type HeaderProps = {
  name: string;
  label: string;
  isExpanded: boolean;
  isMultiple?: boolean;
  onArrowClick: () => void;
  onTrashClick?: () => void;
};
