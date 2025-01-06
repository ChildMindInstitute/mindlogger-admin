import { TooltipProps } from '@mui/material';

import { getEntityKey, getObjectFromList } from 'shared/utils';
import i18n from 'i18n';
import { StyledMdPreview } from 'modules/Builder/components/ItemFlowSelectController/StyledMdPreview/StyledMdPreview.styles';

import { GetItemsOptionsProps } from '../SummaryRow.types';
import { ITEMS_RESPONSE_TYPES_TO_SHOW } from '../SummaryRow.const';

const { t } = i18n;

export const getItemsOptions = ({ items, itemsInUsage, conditions }: GetItemsOptionsProps) => {
  const itemsObject = getObjectFromList(items, undefined, true);
  const conditionItemsInUsageSet = new Set(
    conditions !== undefined ? conditions.map((condition) => condition.itemName) : [],
  );

  const maxUsedItemIndex = Math.max(
    ...[...conditionItemsInUsageSet].map((key) => itemsObject[key]?.index ?? -1),
  );

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
          tooltipPlacement: 'right' as TooltipProps['placement'],
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
          tooltipPlacement: 'right' as TooltipProps['placement'],
        },
      ];
    }

    // #last rule: usage in other conditionals
    const disabled = itemsInUsage.has(value);
    const showTooltip = disabled || item.question;
    const tooltipPlacement: TooltipProps['placement'] | undefined = showTooltip
      ? 'right'
      : undefined;
    const tooltip = disabled ? (
      t('conditionalLogicValidation.usageInSummaryRow')
    ) : (
      <StyledMdPreview modelValue={item.question ?? ''} />
    );

    return [...optionList, { value, labelKey: item.name, disabled, tooltip, tooltipPlacement }];
  }, []);
};
