import { KeyboardEvent } from 'react';

import i18n from 'i18n';

import { ItemInputTypes, ItemsOption } from '../ItemConfiguration.types';
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

export const notHaveSearchValue = (value: string, searchTermLowercase: string) =>
  t(value).toLowerCase().indexOf(searchTermLowercase) === -1;

export const getItemTypesNames = (): string[] =>
  Object.keys(ItemInputTypes).map((key) =>
    t(ItemInputTypes[key as keyof typeof ItemInputTypes]).toLowerCase(),
  );

export const getEmptyComponent = (searchTerm: string) => {
  if (getItemTypesNames().some((name) => name.includes(searchTerm.toLowerCase()))) return null;

  return <EmptySearch description={t('noMatchWasFound', { searchValue: searchTerm })} />;
};

export const getGroupName = (
  groupName: string,
  options: ItemsOption[],
  searchTermLowercase: string,
) => {
  if (options.some(({ value }) => t(value).toLowerCase().includes(searchTermLowercase))) {
    return <StyledGroupName key={groupName}>{t(groupName)}</StyledGroupName>;
  }

  return [];
};
