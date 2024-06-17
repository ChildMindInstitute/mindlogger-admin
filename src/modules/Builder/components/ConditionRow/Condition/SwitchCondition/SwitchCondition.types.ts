import { ReactNode } from 'react';


import {
  ConditionItem,
  ConditionProps,
} from '../Condition.types';

export type SwitchConditionProps = {
  selectedItem?: ConditionItem;
  dataTestid: ConditionProps['data-testid'];
  children: ReactNode;
} & Pick<ConditionProps, 'payloadName' | 'state' | 'valueOptions'>;
