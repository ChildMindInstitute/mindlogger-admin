import { Condition } from 'shared/state';

export type ItemFlowProps = {
  name: string;
  index: number;
  onRemove: () => void;
};

export type ContentProps = {
  items: Condition[];
  name: string;
  onRemove: (index: number) => void;
};
