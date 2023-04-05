import { KeyboardEvent } from 'react';
import Highlighter from 'react-highlight-words';

import i18n from 'i18n';
import { ItemResponseType } from 'shared/state';

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

export const getGroupValueText = (searchTerm: string, groupValue: string) => {
  const text = t(groupValue);

  if (!searchTerm) return text;

  return (
    <Highlighter
      highlightClassName="marked"
      searchWords={[searchTerm]}
      autoEscape={true}
      textToHighlight={text}
    />
  );
};
