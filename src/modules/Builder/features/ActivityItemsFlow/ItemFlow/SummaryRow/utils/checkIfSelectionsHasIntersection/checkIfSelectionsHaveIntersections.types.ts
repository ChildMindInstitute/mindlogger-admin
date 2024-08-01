import { ConditionType } from 'shared/consts';

import { ConditionWithResponseValues } from '../../SummaryRow.types';

export type GroupedConditionsByRow = Record<string, ConditionWithResponseValues[]>;

export type CheckIfSelectionPerRowHaveIntersectionsProps = {
  sameOptionValue: ConditionType.EqualToOption | ConditionType.IncludesOption;
  inverseOptionValue: ConditionType.NotEqualToOption | ConditionType.NotIncludesOption;
};

export type CheckIfSelectionsHaveIntersectionsProps =
  CheckIfSelectionPerRowHaveIntersectionsProps & {
    conditions: ConditionWithResponseValues[];
    optionsLength?: number;
    noneAboveId?: string;
    isSingleSelect?: boolean;
  };
