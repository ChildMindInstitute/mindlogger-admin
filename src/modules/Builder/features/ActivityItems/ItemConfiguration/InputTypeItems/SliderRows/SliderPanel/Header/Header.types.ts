export type HeaderProps = {
  name: string;
  index?: number;
  label: string;
  isExpanded: boolean;
  isMultiple?: boolean;
  onArrowClick: () => void;
  onTrashClick?: () => void;
};
