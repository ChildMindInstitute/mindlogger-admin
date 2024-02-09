import { useState, useEffect } from 'react';

import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

import { ContentWithTooltip } from 'shared/components/ContentWithTooltip';
import { StyledBodyMedium, StyledLabelLarge, variables } from 'shared/styles';
import { getEntityKey } from 'shared/utils';

import { StyledCheckbox, StyledTableCell, StyledTableContainer, StyledHeadCell } from './DataTable.styles';
import { DataTableItem, DataTableProps } from './DataTable.types';

export const DataTable = ({
  data,
  columns: dataTableColumns,
  selectable = false,
  selectAll = true,
  selectedItems,
  noDataPlaceholder,
  onSelect,
  onSelectAll,
  hasError,
  tableHeadBackground,
  tooltipByDefault,
  itemsLength,
  'data-testid': dataTestid,
}: DataTableProps) => {
  const [selected, setSelected] = useState<(string | number)[]>(selectedItems || []);

  const getItemKey = (item: DataTableItem) => item.id;

  useEffect(() => {
    if (selectedItems) setSelected(selectedItems);
  }, [selectedItems]);

  const isAllSelected = !!itemsLength && itemsLength !== 0 && selected?.length === itemsLength;

  const handleSelect = (item: DataTableItem, prevSelected: boolean) => {
    const key = getItemKey(item);

    if (onSelect) return onSelect(key, prevSelected);

    if (prevSelected) return setSelected(selected.filter((selectedKey) => selectedKey !== key));

    setSelected([...selected, key]);
  };

  const handleSelectAll = () => {
    if (onSelectAll) return onSelectAll(isAllSelected);

    if (isAllSelected) return setSelected([]);

    setSelected(data?.map((item) => getItemKey(item)) ?? []);
  };

  return (
    <StyledTableContainer hasError={hasError} data-testid={dataTestid}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {selectable && selectAll && data?.length ? (
              <StyledHeadCell tableHeadBackground={tableHeadBackground} sx={{ width: '2.8rem' }}>
                <StyledCheckbox
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  disabled={!data?.length}
                  data-testid={`${dataTestid}-select-all`}
                />
              </StyledHeadCell>
            ) : null}
            {dataTableColumns?.map(({ key, label, styles = {} }) => (
              <StyledHeadCell tableHeadBackground={tableHeadBackground} sx={styles} key={`data-table-head-${key}`}>
                <StyledBodyMedium sx={{ color: variables.palette.outline }}>{label}</StyledBodyMedium>
              </StyledHeadCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((item, index) => {
            const isSelected = selected?.includes(getItemKey(item));

            return (
              <TableRow key={`data-table-row-${getEntityKey(item) || index}`}>
                {selectable && (
                  <TableCell sx={{ width: '2.8rem', backgroundColor: 'inherit' }}>
                    <StyledCheckbox
                      checked={isSelected}
                      onChange={() => handleSelect(item, isSelected)}
                      data-testid={`${dataTestid}-checkbox-${index}`}
                    />
                  </TableCell>
                )}
                {dataTableColumns?.map(({ key }) => (
                  <StyledTableCell sx={{ backgroundColor: 'inherit' }} key={`data-table-cell-${key}`}>
                    <ContentWithTooltip
                      value={item.tooltip ?? item[key]}
                      item={item}
                      tooltipByDefault={tooltipByDefault}
                    />
                  </StyledTableCell>
                ))}
              </TableRow>
            );
          })}
          {!data?.length && (
            <TableRow className="empty-state">
              <TableCell sx={{ textAlign: 'left', backgroundColor: 'inherit' }}>
                <StyledLabelLarge>{noDataPlaceholder}</StyledLabelLarge>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
};
