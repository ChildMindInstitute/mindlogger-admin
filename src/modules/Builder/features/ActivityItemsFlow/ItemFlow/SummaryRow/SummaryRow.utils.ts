import i18n from 'i18n';
import { ConditionalLogicMatch, ItemResponseType, ConditionType } from 'shared/consts';
import { getEntityKey } from 'shared/utils';
import { getObjectFromList } from 'shared/utils/getObjectFromList';
import { Option } from 'shared/components/FormComponents/SelectController/SelectController.types';
import {
  OptionCondition,
  SingleMultiSelectionPerRowCondition,
  Condition,
} from 'shared/state/Applet';

import { ITEMS_RESPONSE_TYPES_TO_SHOW } from './SummaryRow.const';
import {
  GetMatchOptionsProps,
  GetItemsInUsageProps,
  GetItemsOptionsProps,
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
const checkIfHasContradiction = (
  conditionsByType: ReturnType<typeof getObjectFromListByResponseType>,
) => {
  const groupedItemsByType = Object.entries(conditionsByType);
  console.log(groupedItemsByType);

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
        return true;
      }
      case ItemResponseType.SingleSelection: {
        const equalToOptionValues = groupedConditions.reduce((acc, condition) => {
          const conditionObject = condition as OptionCondition;
          if (conditionObject.type === ConditionType.EqualToOption) {
            return acc.add(conditionObject.payload.optionValue);
          }

          return acc;
        }, new Set<string | number>());
        const notEqualToOptionValues = groupedConditions.reduce((acc, condition) => {
          const conditionObject = condition as OptionCondition;
          if (conditionObject.type === ConditionType.NotEqualToOption) {
            return acc.add(conditionObject.payload.optionValue);
          }

          return acc;
        }, new Set<string | number>());
        const intersect = [...equalToOptionValues].filter((i) => notEqualToOptionValues.has(i));
        if (intersect.length > 0) return true;

        return false;
      }
      case ItemResponseType.SingleSelectionPerRow: {
        const groupedConditionsByRow = groupedConditions.reduce(
          (acc, condition) => {
            const payload = (condition as SingleMultiSelectionPerRowCondition).payload;
            if (typeof payload?.rowIndex !== 'string') return acc;

            if (acc[payload?.rowIndex])
              return {
                ...acc,
                [payload?.rowIndex]: acc[payload?.rowIndex].concat(condition),
              };

            return {
              ...acc,
              [payload?.rowIndex]: [condition],
            };
          },
          {} as Record<string, Condition[]>,
        );

        return Object.entries(groupedConditionsByRow).some((entity) => {
          const conditions = entity[1];
          const includesOptionValues = conditions.reduce((acc, condition) => {
            const conditionObject = condition as SingleMultiSelectionPerRowCondition;
            if (conditionObject.type === ConditionType.EqualToOption) {
              return acc.add(conditionObject.payload.optionValue);
            }

            return acc;
          }, new Set<string | number>());
          const notIncludesOptionValues = conditions.reduce((acc, condition) => {
            const conditionObject = condition as SingleMultiSelectionPerRowCondition;
            if (conditionObject.type === ConditionType.NotEqualToOption) {
              return acc.add(conditionObject.payload.optionValue);
            }

            return acc;
          }, new Set<string | number>());
          const intersect = [...includesOptionValues].filter((i) => notIncludesOptionValues.has(i));
          if (intersect.length > 0) return true;

          return false;
        });
      }
      case ItemResponseType.MultipleSelection: {
        const includesOptionValues = groupedConditions.reduce((acc, condition) => {
          const conditionObject = condition as OptionCondition;
          if (conditionObject.type === ConditionType.IncludesOption) {
            return acc.add(conditionObject.payload.optionValue);
          }

          return acc;
        }, new Set<string | number>());
        const notIncludesOptionValues = groupedConditions.reduce((acc, condition) => {
          const conditionObject = condition as OptionCondition;
          if (conditionObject.type === ConditionType.NotIncludesOption) {
            return acc.add(conditionObject.payload.optionValue);
          }

          return acc;
        }, new Set<string | number>());
        const intersect = [...includesOptionValues].filter((i) => notIncludesOptionValues.has(i));
        if (intersect.length > 0) return true;

        return false;
      }
      case ItemResponseType.MultipleSelectionPerRow: {
        const groupedConditionsByRow = groupedConditions.reduce(
          (acc, condition) => {
            const payload = (condition as SingleMultiSelectionPerRowCondition).payload;
            if (typeof payload?.rowIndex !== 'string') return acc;

            if (acc[payload?.rowIndex])
              return {
                ...acc,
                [payload?.rowIndex]: acc[payload?.rowIndex].concat(condition),
              };

            return {
              ...acc,
              [payload?.rowIndex]: [condition],
            };
          },
          {} as Record<string, Condition[]>,
        );

        return Object.entries(groupedConditionsByRow).some((entity) => {
          const conditions = entity[1];
          const includesOptionValues = conditions.reduce((acc, condition) => {
            const conditionObject = condition as SingleMultiSelectionPerRowCondition;
            if (conditionObject.type === ConditionType.IncludesOption) {
              return acc.add(conditionObject.payload.optionValue);
            }

            return acc;
          }, new Set<string | number>());
          const notIncludesOptionValues = conditions.reduce((acc, condition) => {
            const conditionObject = condition as SingleMultiSelectionPerRowCondition;
            if (conditionObject.type === ConditionType.NotIncludesOption) {
              return acc.add(conditionObject.payload.optionValue);
            }

            return acc;
          }, new Set<string | number>());
          const intersect = [...includesOptionValues].filter((i) => notIncludesOptionValues.has(i));
          if (intersect.length > 0) return true;

          return false;
        });
      }
      default:
        return false;
    }
  });

  return hasContradiction;
};

export const getMatchOptions = ({ items, conditions }: GetMatchOptionsProps): Option[] => {
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
        : t('all'),
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
    const tooltip = disabled ? t('conditionalLogicValidation.usageInSummaryRow') : undefined;

    return [...optionList, { value, labelKey: item.name, disabled, tooltip }];
  }, []);
};

export const getItemsInUsage = ({ conditionalLogic, itemKey }: GetItemsInUsageProps) =>
  (conditionalLogic ?? []).reduce((acc, conditional) => {
    if (!conditional.itemKey || conditional.itemKey === itemKey) return acc;

    return acc.add(conditional.itemKey);
  }, new Set());
