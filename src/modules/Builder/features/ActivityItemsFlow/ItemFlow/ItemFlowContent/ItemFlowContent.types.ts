import { Condition } from 'shared/state';

export type ItemFlowContentProps = {
  items: Condition[];
  name: string;
  'data-testid'?: string;
  onRemove: (index: number) => void;
};
