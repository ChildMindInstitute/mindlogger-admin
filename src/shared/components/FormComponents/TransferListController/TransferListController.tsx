import { ChangeEvent, useRef, useState } from 'react';
import { Controller, FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DataTableItem, DataTableProps, SmartDataTable } from 'shared/components/DataTable';
import { Svg } from 'shared/components/Svg';
import { StyledFlexColumn, StyledTitleMedium } from 'shared/styles';

import {
  StyledErrorContainer,
  StyledTextField,
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
  tableHeadBackground,
  tooltipByDefault,
  onChangeSelectedCallback,
  useVirtualizedList = false,
  'data-testid': dataTestid,
}: TransferListControllerProps<T>) => {
  const { t } = useTranslation('app');

  const [search, setSearch] = useState('');
  // Track the latest selected keys across rapid interactions to avoid lost updates
  const selectedRef = useRef<string[]>([]);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => setSearch(event.target.value);

  const getItemKey = (item: DataTableItem) => item.id;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        // Sync the ref to the current value each render so event handlers see the latest state
        selectedRef.current = (value || []) as string[];

        const selectionSectionItems =
          selectedItems ?? items?.filter((item) => value?.includes(getItemKey(item)));

        const handleSelect: DataTableProps['onSelect'] = (selectedKey, isSelected) => {
          const key = selectedKey as string;
          const prev = selectedRef.current || [];
          let next: string[];

          if (isSelected) {
            next = prev.filter((k: string) => k !== key);
          } else if (prev.includes(key)) {
            next = prev;
          } else {
            next = [...prev, key];
          }

          // Update the ref immediately so subsequent fast clicks see the latest state
          selectedRef.current = next;
          onChange(next);
          onChangeSelectedCallback?.(next);
        };

        const handleSelectAll = (isAllSelected: boolean) => {
          const mapped = (items?.map((item) => getItemKey(item)) as string[]) || [];
          const next = isAllSelected ? [] : mapped;
          selectedRef.current = next;
          onChange(next);
          onChangeSelectedCallback?.(next);
        };

        const isSearchable = hasSearch && search && searchKey;

        const filteredData = isSearchable
          ? items?.filter((item) =>
              `${item[searchKey] || ''}`.toLowerCase().includes(search.toLowerCase()),
            )
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
              <SmartDataTable
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
                forceVirtualization={useVirtualizedList}
                data-testid={`${dataTestid}-unselected`}
              />
              {hasSelectedSection && (
                <SmartDataTable
                  columns={selectedItemsColumns || columns}
                  data={selectionSectionItems}
                  noDataPlaceholder={t('noSelectedItemsYet')}
                  itemsLength={selectionSectionItems?.length}
                  tooltipByDefault={tooltipByDefault}
                  forceVirtualization={useVirtualizedList}
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
