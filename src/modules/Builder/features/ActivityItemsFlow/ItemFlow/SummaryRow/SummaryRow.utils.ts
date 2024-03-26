import i18n from 'i18n';
import { ConditionalLogicMatch } from 'shared/consts';
import { getEntityKey } from 'shared/utils';
import { ConditionalLogic } from 'shared/state/Applet';

import { ITEMS_RESPONSE_TYPES_TO_SHOW } from './SummaryRow.const';
import { GetItemsOptionsProps } from './SummaryRow.types';

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

export const getItemsOptions = ({ items, itemsInUsage }: GetItemsOptionsProps) =>
  items?.reduce((optionList: { value: string; labelKey: string }[], item) => {
    if (item.responseType && ITEMS_RESPONSE_TYPES_TO_SHOW.includes(item.responseType)) {
      const value = getEntityKey(item);
      const disabled = itemsInUsage.has(value);
      const tooltip = disabled ? t('conditionalLogicValidation.usageInSummaryRow') : undefined;

      return [...optionList, { value, labelKey: item.name, disabled, tooltip }];
    }

    return optionList;
  }, []);

export const getItemsInUsage = ({
  conditionalLogic,
  itemKey,
}: {
  conditionalLogic: ConditionalLogic[];
  itemKey: string;
}) =>
  conditionalLogic.reduce((acc, conditional) => {
    if (!conditional.itemKey || conditional.itemKey === itemKey) return acc;

    return acc.add(conditional.itemKey);
  }, new Set());
