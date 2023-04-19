import { v4 as uuidv4 } from 'uuid';

import i18n from 'i18n';
import { ActivitySettingsSubscale } from 'shared/state';
import { ItemFormValues } from 'modules/Builder/pages';
import { ItemResponseType, SubscaleTotalScore } from 'shared/consts';
import { getEntityKey, getMapFromList } from 'shared/utils';

import {
  SharedElementColumns,
  SubscaleColumns,
  SubscaleContentProps,
} from './SubscalesConfiguration.types';

const { t } = i18n;

export const getSubscalesDefaults = () => ({
  name: '',
  scoring: SubscaleTotalScore.Sum,
  items: [],
  id: uuidv4(),
});

export const getItemNameInSubscale = (item: ItemFormValues) =>
  `${t('item_one')}: ${t(item.responseType)}: ${t(item.name)}`;

export const getItemElementName = (item: ItemFormValues) =>
  `${getItemNameInSubscale(item)}: ${t(item.question)}`;

export const getSubscaleElementName = (
  subscale: ActivitySettingsSubscale,
  subscalesMap: Record<string, ActivitySettingsSubscale>,
  itemsMap: Record<string, ItemFormValues>,
) =>
  `${t('subscale')}: ${subscale.name} (${subscale.items
    .map((itemId) => {
      const item = itemsMap[itemId];
      const subscale = subscalesMap[itemId];
      if (item) return getItemNameInSubscale(item);
      if (subscale) return `${t('subscale')}: ${subscale.name}`;

      return '';
    })
    .filter(Boolean)
    .join(', ')})`;

export const filterItemElements = (item: ItemFormValues) =>
  [
    ItemResponseType.SingleSelection,
    ItemResponseType.MultipleSelection,
    ItemResponseType.Slider,
  ].includes(item.responseType as ItemResponseType);

export const getItemElements = (
  subscaleId: string,
  items: ItemFormValues[] = [],
  subscales: ActivitySettingsSubscale[] = [],
) => {
  if (!items) return [];

  const itemsMap = getMapFromList(items);
  const subscalesMap = getMapFromList(subscales);
  const subscaleElements = subscales
    .filter((subscale) => subscale.id !== subscaleId)
    .map((subscale) => ({
      id: subscale.id ?? '',
      [SubscaleColumns.Name]: getSubscaleElementName(subscale, subscalesMap, itemsMap),
    }));
  const itemElements = items.map((item) => ({
    id: getEntityKey(item),
    [SubscaleColumns.Name]: getItemElementName(item),
  }));

  return subscaleElements.concat(itemElements);
};

export const getPropertiesToFilterByIds = (
  items: ItemFormValues[] = [],
  subscales: ActivitySettingsSubscale[] = [],
) => {
  const itemsMap = getMapFromList(items);
  const subscalesMap = getMapFromList(subscales);
  const allSubscaleIds = subscales.map((subscale) => getEntityKey(subscale));
  const allItemIds = items.map((item) => getEntityKey(item));
  const mergedIds = allSubscaleIds.concat(allItemIds);
  const usedUniqueElementsIds = [
    ...new Set(subscales.reduce((acc, subscale) => acc.concat(subscale.items), [] as string[])),
  ];

  return {
    itemsMap,
    subscalesMap,
    mergedIds,
    usedUniqueElementsIds,
  };
};

export const getNotUsedElements = (
  subscalesMap: Record<string, ActivitySettingsSubscale>,
  itemsMap: Record<string, ItemFormValues>,
  mergedIds: string[],
  usedUniqueElementsIds: string[],
) => {
  const filteredIds = mergedIds.filter((id) => !usedUniqueElementsIds.includes(id));
  const elements = filteredIds
    .map((id) => {
      const subscale = subscalesMap[id];
      const item = itemsMap[id];

      if (item)
        return {
          id,
          [SubscaleColumns.Name]: getItemNameInSubscale(item),
        };
      if (subscale)
        return {
          id,
          [SubscaleColumns.Name]: getSubscaleElementName(subscale, subscalesMap, itemsMap),
        };

      return null;
    })
    .filter(Boolean);

  return elements as SubscaleContentProps['notUsedElements'];
};

export const getUsedWithinSubscalesElements = (
  subscales: ActivitySettingsSubscale[] = [],
  subscalesMap: Record<string, ActivitySettingsSubscale>,
  itemsMap: Record<string, ItemFormValues>,
  mergedIds: string[],
  usedUniqueElementsIds: string[],
) => {
  const filteredIds = mergedIds.filter((id) => usedUniqueElementsIds.includes(id));
  const elements = filteredIds
    .map((id) => {
      const subscale = subscalesMap[id];
      const item = itemsMap[id];

      if (item)
        return {
          id,
          [SharedElementColumns.Element]: getItemNameInSubscale(item),
          [SharedElementColumns.Subscale]:
            (subscales.find((subscale) => subscale.items.includes(id)) ?? {}).name ?? '',
        };
      if (subscale)
        return {
          id,
          [SharedElementColumns.Element]: getSubscaleElementName(subscale, subscalesMap, itemsMap),
          [SharedElementColumns.Subscale]:
            (subscales.find((subscale) => subscale.items.includes(id)) ?? {}).name ?? '',
        };

      return null;
    })
    .filter(Boolean);

  return elements as {
    id: string;
    [SharedElementColumns.Element]: string;
    [SharedElementColumns.Subscale]: string;
  }[];
};

export const columns = [
  {
    key: SubscaleColumns.Name,
    label: t('availableElements'),
  },
];

export const notUsedElementsTableColumns = [
  {
    key: SubscaleColumns.Name,
    label: t('elementsNotIncludedInSubscale'),
  },
];

export const allElementColumns = [
  {
    key: SharedElementColumns.Element,
    label: t('element'),
  },
  {
    key: SharedElementColumns.Subscale,
    label: t('subscale'),
  },
];
