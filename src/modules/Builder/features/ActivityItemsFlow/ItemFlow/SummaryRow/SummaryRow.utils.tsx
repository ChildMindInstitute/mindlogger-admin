import i18n from 'i18n';
import { ConditionalLogicMatch, ItemResponseType, ConditionType } from 'shared/consts';
import { getEntityKey } from 'shared/utils';
import { StyledMdPreview } from 'modules/Builder/components/ItemFlowSelectController/StyledMdPreview/StyledMdPreview.styles';
import { getObjectFromList } from 'shared/utils/getObjectFromList';
import { Option } from 'shared/components/FormComponents/SelectController/SelectController.types';
import {
  OptionCondition,
  SingleMultiSelectionPerRowCondition,
  Condition,
} from 'shared/state/Applet';

import { ITEMS_RESPONSE_TYPES_TO_SHOW } from './SummaryRow.const';
import {
  CheckIfSelectionsIntersectionProps,
  GetMatchOptionsProps,
  GetItemsInUsageProps,
  GetItemsOptionsProps,
  GroupedConditionsByRow,
  ConditionWithResponseType,
} from './SummaryRow.types';

const { t } = i18n;

const getObjectFromListByResponseType = (conditions: ConditionWithResponseType[]) =>
  conditions.reduce(
    (acc, condition) => {
      const itemType = condition.responseType;
      if (!itemType) return acc;

      const conditionWithoutResponseType = { ...condition, responseType: undefined };
      if (acc[itemType])
        return {
          ...acc,
          [itemType]: acc[itemType].concat(conditionWithoutResponseType),
        };

      return {
        ...acc,
        [itemType]: [conditionWithoutResponseType],
      };
    },
    {} as Record<ItemResponseType, Condition[]>,
  );

const checkIfSelectionPerRowHasIntersection = <T extends SingleMultiSelectionPerRowCondition>({
  conditions,
  sameOptionValue,
  inverseOptionValue,
}: CheckIfSelectionsIntersectionProps) => {
  const groupedConditionsByRow = conditions.reduce((acc, condition) => {
    const payload = (condition as T).payload;
    const rowIndex = payload?.rowIndex;
    if (rowIndex === undefined || rowIndex === '') return acc;

    if (acc[+rowIndex])
      return {
        ...acc,
        [+rowIndex]: acc[+rowIndex].concat(condition),
      };

    return {
      ...acc,
      [+rowIndex]: [condition],
    };
  }, {} as GroupedConditionsByRow);

  return Object.entries(groupedConditionsByRow).some((entity) =>
    checkIfSelectionsIntersection({
      conditions: entity[1],
      sameOptionValue,
      inverseOptionValue,
    }),
  );
};

const checkIfSelectionsIntersection = <
  T extends OptionCondition | SingleMultiSelectionPerRowCondition,
>({
  conditions,
  sameOptionValue,
  inverseOptionValue,
}: CheckIfSelectionsIntersectionProps) => {
  const sameOptionValues = conditions.reduce((acc, condition) => {
    const conditionObject = condition as T;
    if (conditionObject.type === sameOptionValue) {
      return acc.add(conditionObject.payload.optionValue);
    }

    return acc;
  }, new Set<T['payload']['optionValue']>());
  const inverseOptionValues = conditions.reduce((acc, condition) => {
    const conditionObject = condition as T;
    if (conditionObject.type === inverseOptionValue) {
      return acc.add(conditionObject.payload.optionValue);
    }

    return acc;
  }, new Set<T['payload']['optionValue']>());
  const intersect = [...sameOptionValues].filter((i) => inverseOptionValues.has(i));
  if (intersect.length > 0) return true;

  return false;
};

const checkIfHasContradiction = (
  conditionsByType: ReturnType<typeof getObjectFromListByResponseType>,
) => {
  const groupedItemsByType = Object.entries(conditionsByType);
  const hasContradiction = groupedItemsByType.some((entity) => {
    const type = entity[0];
    const groupedConditions = entity[1];

    switch (type) {
      case ItemResponseType.Slider:
      case ItemResponseType.Date:
      case ItemResponseType.NumberSelection:
      case ItemResponseType.Time:
      case ItemResponseType.TimeRange:
      case ItemResponseType.SliderRows: {
        // ConditionType.GreaterThan
        // ConditionType.LessThan
        // ConditionType.Equal
        // ConditionType.NotEqual
        // ConditionType.Between
        // ConditionType.OutsideOf
        //
        return false;
      }
      case ItemResponseType.SingleSelection:
        return checkIfSelectionsIntersection({
          conditions: groupedConditions,
          sameOptionValue: ConditionType.EqualToOption,
          inverseOptionValue: ConditionType.NotEqualToOption,
        });

      case ItemResponseType.SingleSelectionPerRow:
        return checkIfSelectionPerRowHasIntersection({
          conditions: groupedConditions,
          sameOptionValue: ConditionType.EqualToOption,
          inverseOptionValue: ConditionType.NotEqualToOption,
        });
      case ItemResponseType.MultipleSelection:
        return checkIfSelectionsIntersection({
          conditions: groupedConditions,
          sameOptionValue: ConditionType.IncludesOption,
          inverseOptionValue: ConditionType.NotIncludesOption,
        });
      case ItemResponseType.MultipleSelectionPerRow:
        return checkIfSelectionPerRowHasIntersection({
          conditions: groupedConditions,
          sameOptionValue: ConditionType.IncludesOption,
          inverseOptionValue: ConditionType.NotIncludesOption,
        });
      default:
        return false;
    }
  });

  return hasContradiction;
};

export const getMatchOptions = ({ items, conditions = [] }: GetMatchOptionsProps): Option[] => {
  const itemsObject = getObjectFromList(items);
  const conditionItems = conditions.reduce((acc, condition) => {
    const item = itemsObject[condition.itemName];
    if (!item) return acc;

    return acc.concat({
      responseType: item.responseType,
      ...condition,
    });
  }, [] as ConditionWithResponseType[]);
  const conditionsByType = getObjectFromListByResponseType(conditionItems);
  const hasContradiction = checkIfHasContradiction(conditionsByType);

  return [
    {
      value: ConditionalLogicMatch.Any,
      labelKey: t('any'),
    },
    {
      value: ConditionalLogicMatch.All,
      labelKey: t('all'),
      disabled: hasContradiction,
      tooltip: hasContradiction
        ? t('conditionalLogicValidation.impossibleToFulfillTheConditionsSimultaneously')
        : undefined,
    },
  ];
};

export const getItemsOptions = ({ items, itemsInUsage, conditions }: GetItemsOptionsProps) => {
  const itemsObject = getObjectFromList(items, undefined, true);
  const conditionItemsInUsageSet = new Set(conditions.map((condition) => condition.itemName));
  const maxUsedItemIndex = [...conditionItemsInUsageSet].reduce((maxIndex, itemKey) => {
    const item = itemsObject[itemKey];
    const itemIndex = item?.index ?? -1;
    if (!item || (typeof itemIndex === 'number' && itemIndex <= maxIndex)) return maxIndex;

    return itemIndex;
  }, -1);

  return items?.reduce((optionList: { value: string; labelKey: string }[], item, index) => {
    if (!item.responseType || !ITEMS_RESPONSE_TYPES_TO_SHOW.includes(item.responseType))
      return optionList;

    const value = getEntityKey(item);
    // 1# rule: summaryItemIsTheSameAsRuleItem
    if (conditionItemsInUsageSet.has(value)) {
      return [
        ...optionList,
        {
          value,
          labelKey: item.name,
          disabled: true,
          tooltip: t('conditionalLogicValidation.summaryItemIsTheSameAsRuleItem'),
        },
      ];
    }
    // 2# rule: summaryItemIsBeforeRuleItemInTheList
    if (index <= maxUsedItemIndex) {
      return [
        ...optionList,
        {
          value,
          labelKey: item.name,
          disabled: true,
          tooltip: t('conditionalLogicValidation.summaryItemIsBeforeRuleItemInTheList'),
        },
      ];
    }

    // #last rule: usage in other conditionals
    const disabled = itemsInUsage.has(value);
    const tooltip = disabled ? (
      t('conditionalLogicValidation.usageInSummaryRow')
    ) : (
      <StyledMdPreview modelValue={item.question ?? ''} />
    );

    return [...optionList, { value, labelKey: item.name, disabled, tooltip }];
  }, []);
};

export const getItemsInUsage = ({ conditionalLogic, itemKey }: GetItemsInUsageProps) =>
  (conditionalLogic ?? []).reduce((acc, conditional) => {
    if (!conditional.itemKey || conditional.itemKey === itemKey) return acc;

    return acc.add(conditional.itemKey);
  }, new Set());
