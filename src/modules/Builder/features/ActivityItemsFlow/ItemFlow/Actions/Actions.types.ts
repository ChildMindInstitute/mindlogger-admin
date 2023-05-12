export type ActionsProps = {
  name: string;
  onAdd: () => void;
  onRemove: () => void;
};

export type ActionsType = Pick<ActionsProps, 'onAdd' | 'onRemove'>;
