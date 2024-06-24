import i18n from 'i18n';
import { ConditionalLogicMatch } from 'shared/consts';
import { getEntityKey } from 'shared/utils';
import { getObjectFromList } from 'shared/utils/getObjectFromList';

import { ITEMS_RESPONSE_TYPES_TO_SHOW } from './SummaryRow.const';
import { GetItemsInUsageProps, GetItemsOptionsProps } from './SummaryRow.types';

const { t } = i18n;

export const getMatchOptions = () => [
  {
    value: ConditionalLogicMatch.Any,
    labelKey: t('any'),
  },
  {
    value: ConditionalLogicMatch.All,
    labelKey: t('all'),
  },
];

export const getItemsOptions = ({ items, itemsInUsage, conditions }: GetItemsOptionsProps) => {
  const itemsObject = getObjectFromList(items, undefined, true);
  const maxUsedItemIndex = [...new Set(conditions.map((condition) => condition.itemName))].reduce(
    (maxIndex, itemKey) => {
      const item = itemsObject[itemKey];
      const itemIndex = item?.index ?? -1;
      if (!item || (typeof itemIndex === 'number' && itemIndex <= maxIndex)) return maxIndex;

      return itemIndex;
    },
    -1,
  );

  return items?.reduce((optionList: { value: string; labelKey: string }[], item, index) => {
    if (!item.responseType || !ITEMS_RESPONSE_TYPES_TO_SHOW.includes(item.responseType))
      return optionList;

    const value = getEntityKey(item);
    // 1# rule: summaryItemIsBeforeRuleItemInTheList
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

    // usage in another conditions
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
