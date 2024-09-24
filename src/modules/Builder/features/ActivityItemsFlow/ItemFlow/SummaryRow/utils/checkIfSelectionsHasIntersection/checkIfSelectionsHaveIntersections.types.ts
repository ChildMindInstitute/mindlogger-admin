import { ConditionType } from 'shared/consts';

import { ConditionWithResponseValues } from '../../SummaryRow.types';

export type GroupedConditionsByRow = Record<string, ConditionWithResponseValues[]>;

export type CheckIfSelectionPerRowHaveIntersectionsProps = {
  sameOptionValue:
    | ConditionType.EqualToOption
    | ConditionType.EqualToRowOption
    | ConditionType.IncludesOption
    | ConditionType.IncludesRowOption;
  inverseOptionValue:
    | ConditionType.NotEqualToOption
    | ConditionType.NotEqualToRowOption
    | ConditionType.NotIncludesOption
    | ConditionType.NotIncludesRowOption;
};

export type CheckIfSelectionsHaveIntersectionsProps =
  CheckIfSelectionPerRowHaveIntersectionsProps & {
    conditions: ConditionWithResponseValues[];
    optionsLength?: number;
    noneAboveId?: string;
    isSingleSelect?: boolean;
  };
