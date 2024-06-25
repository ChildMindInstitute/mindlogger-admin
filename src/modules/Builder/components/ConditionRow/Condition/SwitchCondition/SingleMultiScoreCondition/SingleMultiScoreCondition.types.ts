import {
  SingleSelectionConditionItem,
  MultiSelectionConditionItem,
  SingleSelectionPerRowConditionItem,
  MultipleSelectionPerRowConditionItem,
  ScoreConditionConditionItem,
} from '../../Condition.types';
import { SwitchConditionProps } from '../SwitchCondition.types';

export type SingleMultiScoreConditionProps = {
  selectedItem:
    | SingleSelectionConditionItem
    | MultiSelectionConditionItem
    | ScoreConditionConditionItem
    | SingleSelectionPerRowConditionItem
    | MultipleSelectionPerRowConditionItem;
} & Pick<SwitchConditionProps, 'dataTestid' | 'valueOptions' | 'payloadName' | 'children'>;
