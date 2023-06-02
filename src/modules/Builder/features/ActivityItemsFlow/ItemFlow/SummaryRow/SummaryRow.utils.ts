import i18n from 'i18n';
import { ItemFormValues } from 'modules/Builder/types';
import { ConditionalLogicMatch } from 'shared/consts';
import { getEntityKey } from 'shared/utils';

import { ITEMS_RESPONSE_TYPES_TO_SHOW } from './SummaryRow.const';

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

export const getItemsOptions = (items: ItemFormValues[]) =>
  items?.reduce((optionList: { value: string; labelKey: string }[], item) => {
    if (item.responseType && ITEMS_RESPONSE_TYPES_TO_SHOW.includes(item.responseType))
      return [...optionList, { value: getEntityKey(item), labelKey: item.name }];

    return optionList;
  }, []);
