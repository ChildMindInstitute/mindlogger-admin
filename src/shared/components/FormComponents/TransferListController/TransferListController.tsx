import { ChangeEvent, useState } from 'react';

import { Controller, FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DataTable, DataTableProps, DataTableItem } from 'shared/components/DataTable';
import { Svg } from 'shared/components/Svg';
import { StyledFlexColumn, StyledTitleMedium } from 'shared/styles';

import { StyledTextField, StyledErrorContainer, StyledTransferListController } from './TransferListController.styles';
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
  tableHeadBackground,
  tooltipByDefault,
  onChangeSelectedCallback,
  'data-testid': dataTestid,
}: TransferListControllerProps<T>) => {
  const { t } = useTranslation('app');

  const [search, setSearch] = useState('');

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => setSearch(event.target.value);

  const getItemKey = (item: DataTableItem) => item.id;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const selectionSectionItems = selectedItems ?? items?.filter(item => value?.includes(getItemKey(item)));

        const handleSelect: DataTableProps['onSelect'] = (selectedKey, isSelected) => {
          const newValues = isSelected
            ? value?.filter((key: string | number) => key !== selectedKey)
            : [...(value || []), selectedKey];
          onChange(newValues);
          onChangeSelectedCallback?.(newValues);
        };

        const handleSelectAll = (isAllSelected: boolean) => {
          const newValues = isAllSelected ? [] : items?.map(item => getItemKey(item)) || [];
          onChange(newValues);
          onChangeSelectedCallback?.(newValues);
        };

        const isSearchable = hasSearch && search && searchKey;

        const filteredData = isSearchable
          ? items?.filter(item => `${item[searchKey] || ''}`.toLowerCase().includes(search.toLowerCase()))
          : items;

        const getNoDataPlaceholder = () => {
          if (isSearchable && filteredData?.length === 0) {
            return t('noMatchWasFoundShort', { searchValue: search });
          }

          return t('noSelectedItemsYet');
        };

        return (
          <StyledFlexColumn sx={{ gap: '1.2rem', width: '100%', ...sxProps }}>
            {caption && <StyledTitleMedium>{caption}</StyledTitleMedium>}
            {hasSearch && (
              <StyledTextField
                value={search}
                onChange={handleSearch}
                placeholder={t('search')}
                InputProps={{ startAdornment: <Svg id="search" /> }}
                data-testid={`${dataTestid}-search`}
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
                noDataPlaceholder={getNoDataPlaceholder()}
                tableHeadBackground={tableHeadBackground}
                tooltipByDefault={tooltipByDefault}
                itemsLength={items?.length}
                data-testid={`${dataTestid}-unselected`}
              />
              {hasSelectedSection && (
                <DataTable
                  columns={selectedItemsColumns || columns}
                  data={selectionSectionItems}
                  noDataPlaceholder={t('noSelectedItemsYet')}
                  data-testid={`${dataTestid}-selected`}
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
