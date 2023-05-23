export type ActionsProps = {
  open: boolean;
  name: string;
  onAdd: () => void;
  onRemove: () => void;
  onToggle: () => void;
};

export type ActionsType = Pick<ActionsProps, 'onAdd' | 'onRemove'>;
