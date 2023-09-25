import { Condition } from 'shared/state';

export type ItemFlowContentProps = {
  name: string;
  conditions: Condition[];
  onRemove: (index: number) => void;
  'data-testid'?: string;
};
