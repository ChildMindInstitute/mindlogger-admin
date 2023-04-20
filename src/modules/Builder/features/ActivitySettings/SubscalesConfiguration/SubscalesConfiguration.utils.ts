import { v4 as uuidv4 } from 'uuid';

import i18n from 'i18n';
import { ActivitySettingsSubscale } from 'shared/state';
import { ItemFormValues } from 'modules/Builder/pages';
import { ItemResponseType, SubscaleTotalScore } from 'shared/consts';
import { capitalize, getEntityKey, getObjectFromList } from 'shared/utils';

import {
  ItemElement,
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
  capitalize(`${t('item_one')}: ${t(item.responseType)}: ${t(item.name)}`);

export const getItemElementName = (item: ItemFormValues) =>
  `${getItemNameInSubscale(item)}: ${t(item.question)}`;

export const getSubscaleElementName = (
  subscale: ActivitySettingsSubscale,
  subscalesMap: Record<string, ActivitySettingsSubscale>,
  itemsMap: Record<string, ItemFormValues>,
) =>
  `${t('subscale')}: ${subscale.name} (${subscale.items
    .reduce((acc, itemId) => {
      const item = itemsMap[itemId];
      const subscale = subscalesMap[itemId];
      if (item) return [...acc, getItemNameInSubscale(item)];
      if (subscale) return [...acc, `${t('subscale')}: ${subscale.name}`];

      return acc;
    }, [] as string[])
    .join(', ')})`;

export const checkOnItemType = (item: ItemFormValues) =>
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

  const itemsMap = getObjectFromList(items);
  const subscalesMap = getObjectFromList(subscales);
  const subscaleElements = subscales.reduce((acc, subscale) => {
    if (subscale.id === subscaleId) return acc;

    return [
      ...acc,
      {
        id: subscale.id ?? '',
        [SubscaleColumns.Name]: getSubscaleElementName(subscale, subscalesMap, itemsMap),
      },
    ];
  }, [] as ItemElement[]);
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
  const itemsMap = getObjectFromList(items);
  const subscalesMap = getObjectFromList(subscales);
  const allSubscaleIds = subscales.map((subscale) => getEntityKey(subscale));
  const allItemIds = items.map((item) => getEntityKey(item));
  const mergedIds = allSubscaleIds.concat(allItemIds);
  const markedUniqueElementsIds = [
    ...new Set(subscales.reduce((acc, subscale) => acc.concat(subscale.items), [] as string[])),
  ];

  return {
    itemsMap,
    subscalesMap,
    mergedIds,
    markedUniqueElementsIds,
  };
};

export const getNotUsedElements = (
  subscalesMap: Record<string, ActivitySettingsSubscale>,
  itemsMap: Record<string, ItemFormValues>,
  mergedIds: string[],
  markedUniqueElementsIds: string[],
) =>
  mergedIds.reduce((acc, id) => {
    if (markedUniqueElementsIds.includes(id)) return acc;

    const subscale = subscalesMap[id];
    const item = itemsMap[id];

    if (item)
      return [
        ...acc,
        {
          id,
          [SubscaleColumns.Name]: getItemNameInSubscale(item),
        },
      ];
    if (subscale)
      return [
        ...acc,
        {
          id,
          [SubscaleColumns.Name]: getSubscaleElementName(subscale, subscalesMap, itemsMap),
        },
      ];

    return acc;
  }, [] as SubscaleContentProps['notUsedElements']);

const getElementName =
  (id: string) => (acc: string[], subscale: { name: string; itemsSet: Set<string> }) => {
    if (!subscale.itemsSet.has(id)) return acc;

    return [...acc, subscale.name];
  };
export const getUsedWithinSubscalesElements = (
  subscales: ActivitySettingsSubscale[] = [],
  subscalesMap: Record<string, ActivitySettingsSubscale>,
  itemsMap: Record<string, ItemFormValues>,
  mergedIds: string[],
  markedUniqueElementsIds: string[],
) => {
  const subscalesWithItemsSet = subscales.map((subscale) => ({
    name: subscale.name,
    itemsSet: subscale.items.reduce((acc, itemId) => acc.add(itemId), new Set<string>()),
  }));

  return mergedIds.reduce(
    (acc, id) => {
      if (!markedUniqueElementsIds.includes(id)) return acc;

      const subscale = subscalesMap[id];
      const item = itemsMap[id];

      if (item)
        return [
          ...acc,
          {
            id,
            [SharedElementColumns.Element]: getItemNameInSubscale(item),
            [SharedElementColumns.Subscale]: subscalesWithItemsSet
              .reduce(getElementName(id), [] as string[])
              .join(', '),
          },
        ];
      if (subscale)
        return [
          ...acc,
          {
            id,
            [SharedElementColumns.Element]: getSubscaleElementName(
              subscale,
              subscalesMap,
              itemsMap,
            ),
            [SharedElementColumns.Subscale]: subscalesWithItemsSet
              .reduce(getElementName(id), [] as string[])
              .join(', '),
          },
        ];

      return acc;
    },
    [] as {
      id: string;
      [SharedElementColumns.Element]: string;
      [SharedElementColumns.Subscale]: string;
    }[],
  );
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

export const allElementsTableColumns = [
  {
    key: SharedElementColumns.Element,
    label: t('element'),
  },
  {
    key: SharedElementColumns.Subscale,
    label: t('subscale'),
  },
];
