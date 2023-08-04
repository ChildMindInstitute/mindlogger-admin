import { FieldValues } from 'react-hook-form';

import { Condition } from 'shared/state';

export type ItemFlowProps = {
  name: string;
  index: number;
  onRemove: () => void;
};

export type ContentProps = {
  items: Condition[];
  name: string;
  conditionalError: FieldValues['error'];
  onRemove: (index: number) => void;
};
