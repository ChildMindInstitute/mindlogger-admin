export type HeaderProps = {
  name: string;
  label: string;
  isExpanded: boolean;
  isMultiple: boolean | undefined;
  onArrowClick: () => void;
  onTrashClick: () => void;
};
