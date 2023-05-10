export type ItemFlowActionsProps = {
  name: string;
  onAdd: () => void;
  onRemove: () => void;
};

export type ActionsType = Pick<ItemFlowActionsProps, 'onAdd' | 'onRemove'>;
