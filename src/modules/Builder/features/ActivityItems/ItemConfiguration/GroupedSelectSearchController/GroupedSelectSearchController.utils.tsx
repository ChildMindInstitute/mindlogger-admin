import { KeyboardEvent } from 'react';

import i18n from 'i18n';
import { ItemResponseType } from 'shared/consts';
import { getHighlightedText } from 'shared/utils';

import { ItemsOption } from '../ItemConfiguration.types';
import { EmptySearch } from './EmptySearch';
import { StyledGroupName } from './GroupedSelectSearchController.styles';

const { t } = i18n;

export const handleSearchKeyDown = (event: KeyboardEvent) => {
  if (event.key !== 'Escape') {
    event.stopPropagation();
  }
  if (event.key === 'Enter') {
    event.preventDefault();
  }
};

export const getIsNotHaveSearchValue = (value: string, searchTermLowercase: string) =>
  t(value).toLowerCase().indexOf(searchTermLowercase) === -1;

export const getItemTypesNames = (): string[] =>
  Object.keys(ItemResponseType).map((key) =>
    t(ItemResponseType[key as keyof typeof ItemResponseType]).toLowerCase(),
  );

export const getEmptyComponent = (searchTerm: string) => {
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

export const getGroupName = (
  groupName: string,
  options: ItemsOption[],
  searchTermLowercase: string,
) => {
  if (options.some(({ value }) => t(value).toLowerCase().includes(searchTermLowercase))) {
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

export const getGroupValueText = (searchTerm: string, groupValue: string) => {
  const text = t(groupValue);

  if (!searchTerm) return text;

  return getHighlightedText(text, searchTerm);
};

export const getIsOnlyMobileValue = (value: ItemResponseType): boolean =>
  [
    ItemResponseType.Drawing,
    ItemResponseType.Photo,
    ItemResponseType.Video,
    ItemResponseType.Geolocation,
    ItemResponseType.Audio,
  ].includes(value);
