import { Trans } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

import i18n from 'i18n';
import { ItemFormValues, SubscaleFormValue } from 'modules/Builder/types';
import { removeMarkdown } from 'modules/Builder/utils';
import { DataTableColumn } from 'shared/components';
import { SubscaleTotalScore } from 'shared/consts';
import { StyledTitleSmall, variables } from 'shared/styles';
import { capitalize, getEntityKey, getObjectFromList } from 'shared/utils';

import { LabelsObject, ModalType } from './LookupTable';
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

export const getItemNameInSubscale = (item: ItemFormValues) => capitalize(`${t('item_one')}: ${t(item.name)}`);

export const getItemElementName = (item: ItemFormValues) =>
  `${getItemNameInSubscale(item)}: ${removeMarkdown(item.question)}`;

export const getSubscaleElementName = (
  subscale: SubscaleFormValue,
  subscalesMap: Record<string, SubscaleFormValue>,
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

export const getItemElements = (
  subscaleId: string,
  items: ItemFormValues[] = [],
  subscales: SubscaleFormValue[] = [],
) => {
  if (!items) return [];

  const itemsMap = getObjectFromList(items);
  const subscalesMap = getObjectFromList(subscales);
  const subscaleElements = subscales.reduce((acc, subscale) => {
    if (subscale.id === subscaleId || subscale.items.includes(subscaleId)) return acc;

    return [
      ...acc,
      {
        id: subscale.id ?? '',
        [SubscaleColumns.Name]: getSubscaleElementName(subscale, subscalesMap, itemsMap),
      },
    ];
  }, [] as ItemElement[]);
  const itemElements = items.map(item => ({
    id: getEntityKey(item),
    [SubscaleColumns.Name]: getItemElementName(item),
  }));

  return subscaleElements.concat(itemElements);
};

export const getPropertiesToFilterByIds = (items: ItemFormValues[] = [], subscales: SubscaleFormValue[] = []) => {
  const itemsMap = getObjectFromList(items);
  const subscalesMap = getObjectFromList(subscales);
  const allSubscaleIds = subscales.map(subscale => getEntityKey(subscale));
  const allItemIds = items.map(item => getEntityKey(item));
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
  subscalesMap: Record<string, SubscaleFormValue>,
  itemsMap: Record<string, ItemFormValues>,
  mergedIds: string[],
  markedUniqueElementsIds: ReturnType<typeof getPropertiesToFilterByIds>['markedUniqueElementsIds'],
) =>
  mergedIds.reduce(
    (acc, id) => {
      if (markedUniqueElementsIds.includes(id)) return acc;

      const subscale = subscalesMap[id];
      const item = itemsMap[id];

      if (item)
        return [
          ...acc,
          {
            id,
            [SubscaleColumns.Name]: getItemElementName(item),
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
    },
    [] as SubscaleContentProps['notUsedElements'],
  );

const getElementName = (id: string) => (acc: string[], subscale: { name: string; itemsSet: Set<string> }) => {
  if (!subscale.itemsSet.has(id)) return acc;

  return [...acc, subscale.name];
};

export const getUsedWithinSubscalesElements = (
  subscales: SubscaleFormValue[] = [],
  subscalesMap: Record<string, SubscaleFormValue>,
  itemsMap: Record<string, ItemFormValues>,
  mergedIds: string[],
  markedUniqueElementsIds: ReturnType<typeof getPropertiesToFilterByIds>['markedUniqueElementsIds'],
) => {
  const subscalesWithItemsSet = subscales.map(subscale => ({
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
            [SharedElementColumns.Element]: getSubscaleElementName(subscale, subscalesMap, itemsMap),
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

export const getColumns = () => [
  {
    key: SubscaleColumns.Name,
    label: t('availableElements'),
  },
];

export const getNotUsedElementsTableColumns = () => [
  {
    key: SubscaleColumns.Name,
    label: t('elementsNotIncludedInSubscale'),
  },
];

export const getAllElementsTableColumns = (): DataTableColumn[] => [
  {
    key: SharedElementColumns.Element,
    label: t('element'),
    styles: {
      width: '70%',
    },
  },
  {
    key: SharedElementColumns.Subscale,
    label: t('subscale'),
  },
];

export const getSubscaleModalLabels = (name?: string): LabelsObject => ({
  [ModalType.Upload]: {
    title: t('subscaleLookupTable.upload.title'),
    initDescription: (
      <Trans i18nKey="subscaleLookupTable.upload.initDescription">
        Please upload file in
        <strong> .csv </strong>
        format
      </Trans>
    ),
    successDescription: (
      <Trans i18nKey="subscaleLookupTable.upload.successDescription">
        Your Lookup Table for
        <strong>
          <> {{ name }} </>
        </strong>
        was parsed successfully.
      </Trans>
    ),
  },
  [ModalType.Edit]: {
    title: t('subscaleLookupTable.edit.title'),
    initDescription: (
      <Trans i18nKey="subscaleLookupTable.edit.initDescription">
        Current Lookup Table for
        <strong>
          <> {{ name }} </>
        </strong>
        .
      </Trans>
    ),
  },
  [ModalType.Delete]: {
    title: t('subscaleLookupTable.delete.title'),
    initDescription: (
      <Trans i18nKey="subscaleLookupTable.delete.initDescription">
        Are you sure you want to delete the Lookup Table for
        <strong>
          <> {{ name }} </>
        </strong>
        ?
      </Trans>
    ),
    successDescription: (
      <Trans i18nKey="subscaleLookupTable.delete.successDescription">
        The current Lookup Table for
        <strong>
          <> {{ name }} </>
        </strong>
        has been deleted successfully.
      </Trans>
    ),
  },
  errors: {
    haveToUploadFile: (
      <StyledTitleSmall sx={{ mt: 2.2 }} color={variables.palette.semantic.error}>
        {t('subscaleLookupTable.errors.haveToUploadFile')}
      </StyledTitleSmall>
    ),
    fileCantBeParsed: (
      <StyledTitleSmall sx={{ color: variables.palette.semantic.error }}>
        {t('subscaleLookupTable.errors.fileCantBeParsed')}
      </StyledTitleSmall>
    ),
    incorrectFileFormat: (
      <StyledTitleSmall sx={{ color: variables.palette.semantic.error }}>
        <Trans i18nKey="subscaleLookupTable.errors.incorrectFileFormat">
          Incorrect file format. Please upload file in
          <strong> .csv. </strong>
          format.
        </Trans>
      </StyledTitleSmall>
    ),
    onDelete: (
      <StyledTitleSmall sx={{ color: variables.palette.semantic.error }}>
        <Trans i18nKey="subscaleLookupTable.errors.onDelete">
          The current Lookup Table for
          <strong>
            <> {{ name }} </>
          </strong>
          has not been deleted. Please try again.
        </Trans>
      </StyledTitleSmall>
    ),
  },
});

export const getAddTotalScoreModalLabels = (): LabelsObject => {
  const labels = getSubscaleModalLabels();

  return {
    ...labels,
    [ModalType.Upload]: {
      ...labels[ModalType.Upload],
      successDescription: <>{t('addTotalScoreLookupTable.upload.successDescription')}</>,
    },
    [ModalType.Edit]: {
      ...labels[ModalType.Edit],
      initDescription: <>{t('addTotalScoreLookupTable.edit.initDescription')}</>,
    },
    [ModalType.Delete]: {
      ...labels[ModalType.Delete],
      initDescription: <>{t('addTotalScoreLookupTable.delete.initDescription')}</>,
      successDescription: <>{t('addTotalScoreLookupTable.delete.successDescription')}</>,
    },
    errors: {
      ...labels.errors,
      onDelete: (
        <StyledTitleSmall sx={{ color: variables.palette.semantic.error }}>
          {t('addTotalScoreLookupTable.errors.onDelete')}
        </StyledTitleSmall>
      ),
    },
  };
};
