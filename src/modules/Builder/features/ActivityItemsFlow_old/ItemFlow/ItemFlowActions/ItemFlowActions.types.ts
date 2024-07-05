export type ItemFlowActionsProps = {
  open: boolean;
  name: string;
  onAdd: () => void;
  onDuplicate: () => void;
  onRemove: () => void;
  onToggle: () => void;
  'data-testid'?: string;
};

export type ItemFlowActionsType = Pick<
  ItemFlowActionsProps,
  'onAdd' | 'onRemove' | 'onDuplicate' | 'data-testid'
>;
