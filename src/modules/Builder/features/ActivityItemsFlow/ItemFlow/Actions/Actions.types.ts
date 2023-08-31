export type ActionsProps = {
  open: boolean;
  name: string;
  onAdd: () => void;
  onRemove: () => void;
  onToggle: () => void;
  'data-testid'?: string;
};

export type ActionsType = Pick<ActionsProps, 'onAdd' | 'onRemove' | 'data-testid'>;
