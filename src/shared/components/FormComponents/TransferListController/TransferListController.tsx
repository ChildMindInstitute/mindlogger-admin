import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, FieldValues } from 'react-hook-form';

import { Svg } from 'shared/components/Svg';
import { DataTable, DataTableProps, DataTableItem } from 'shared/components/DataTable';
import { StyledFlexColumn, StyledTitleMedium } from 'shared/styles';

import {
  StyledTextField,
  StyledErrorContainer,
  StyledTransferListController,
} from './TransferListController.styles';
import { TransferListControllerProps } from './TransferListController.types';

export const TransferListController = <T extends FieldValues>({
  name,
  control,
  caption,
  searchKey,
  items,
  selectedItems,
  columns,
  selectedItemsColumns,
  sxProps = {},
  readOnly = false,
  hasSearch = true,
  hasSelectedSection = true,
  isValueName = false,
}: TransferListControllerProps<T>) => {
  const { t } = useTranslation('app');

  const [search, setSearch] = useState('');

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => setSearch(event.target.value);

  const getItemKey = (item: DataTableItem) => (isValueName ? item.name || '' : item.id);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const selectionSectionItems =
          selectedItems ?? items?.filter((item) => value?.includes(getItemKey(item)));

        const handleSelect: DataTableProps['onSelect'] = (selectedKey, isSelected) => {
          if (isSelected)
            return onChange(value?.filter((key: string | number) => key !== selectedKey));

          onChange([...value, selectedKey]);
        };

        const handleSelectAll = (isAllSelected: boolean) => {
          onChange(isAllSelected ? [] : items?.map((item) => getItemKey(item)));
        };

        const filteredData =
          hasSearch && search && searchKey
            ? items?.filter((item) =>
                `${item[searchKey] || ''}`.toLowerCase().includes(search.toLowerCase()),
              )
            : items;

        return (
          <StyledFlexColumn sx={{ gap: '1.2rem', width: '100%', ...sxProps }}>
            {caption && <StyledTitleMedium>{caption}</StyledTitleMedium>}
            {hasSearch && (
              <StyledTextField
                value={search}
                onChange={handleSearch}
                placeholder={t('search')}
                InputProps={{ startAdornment: <Svg id="search" /> }}
              />
            )}
            <StyledTransferListController hasError={!!error}>
              <DataTable
                columns={columns}
                data={filteredData}
                selectable={!readOnly}
                selectedItems={value}
                onSelect={handleSelect}
                onSelectAll={handleSelectAll}
                hasError={!!error}
                noDataPlaceholder={t('noSelectedItemsYet')}
                isValueName={isValueName}
              />
              {hasSelectedSection && (
                <DataTable
                  columns={selectedItemsColumns || columns}
                  data={selectionSectionItems}
                  noDataPlaceholder={t('noSelectedItemsYet')}
                  isValueName={isValueName}
                />
              )}
              {error && <StyledErrorContainer>{error?.message}</StyledErrorContainer>}
            </StyledTransferListController>
          </StyledFlexColumn>
        );
      }}
    />
  );
};
