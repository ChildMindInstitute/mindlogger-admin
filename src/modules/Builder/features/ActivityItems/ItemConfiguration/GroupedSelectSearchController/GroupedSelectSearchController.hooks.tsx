import { useTranslation } from 'react-i18next';

import { ItemResponseType, textLanguageKey } from 'shared/consts';
import { getHighlightedText } from 'shared/utils/getHighlightedText';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';

import { EmptySearch } from './EmptySearch';
import { ItemsOption } from '../ItemConfiguration.types';
import { StyledGroupName } from './GroupedSelectSearchController.styles';

export const useItemTypeSelectSetup = () => {
  const { t } = useTranslation('app');
  const {
    featureFlags: { enableParagraphTextItem },
  } = useFeatureFlags();

  const getItemLanguageKey = (value: string) => {
    if (!enableParagraphTextItem) return value;

    return value === ItemResponseType.Text ? textLanguageKey : value;
  };

  const getIsNotHaveSearchValue = (value: string, searchTermLowercase: string) =>
    t(getItemLanguageKey(value)).toLowerCase().indexOf(searchTermLowercase) === -1;

  const getItemTypesNames = (): string[] =>
    Object.keys(ItemResponseType).map((key) =>
      t(
        enableParagraphTextItem && key === 'Text'
          ? textLanguageKey
          : ItemResponseType[key as keyof typeof ItemResponseType],
      ).toLowerCase(),
    );

  const getEmptyComponent = (searchTerm: string) => {
    if (getItemTypesNames().some((name) => name.includes(searchTerm.toLowerCase()))) return null;
    const MAX_SEARCH_VALUE_LENGTH = 80;

    const searchValue =
      searchTerm.length > MAX_SEARCH_VALUE_LENGTH
        ? `${searchTerm.substring(0, MAX_SEARCH_VALUE_LENGTH)}...`
        : searchTerm;

    return (
      <EmptySearch
        data-testid="builder-activity-items-item-configuration-response-type-empty-search"
        description={t('noMatchWasFound', { searchValue })}
      />
    );
  };

  const getGroupName = (groupName: string, options: ItemsOption[], searchTermLowercase: string) => {
    if (
      options.some(({ value }) =>
        t(getItemLanguageKey(value)).toLowerCase().includes(searchTermLowercase),
      )
    ) {
      return (
        <StyledGroupName
          key={groupName}
          data-testid={`builder-activity-items-item-configuration-response-type-group-${groupName}`}
        >
          {t(groupName)}
        </StyledGroupName>
      );
    }

    return [];
  };

  const getGroupValueText = (searchTerm: string, groupValue: string) => {
    const text = t(getItemLanguageKey(groupValue));

    if (!searchTerm) return text;

    return getHighlightedText(text, searchTerm);
  };

  return {
    getItemLanguageKey,
    getIsNotHaveSearchValue,
    getEmptyComponent,
    getGroupName,
    getGroupValueText,
  };
};
