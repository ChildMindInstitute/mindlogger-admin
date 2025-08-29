import { Box, Table, TableCell, TableHead, TableRow } from '@mui/material';
import { CSSProperties, useCallback, useEffect, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';

import { ContentWithTooltip } from 'shared/components/ContentWithTooltip';
import { StyledBodyMedium, StyledLabelLarge, variables } from 'shared/styles';
import { getEntityKey } from 'shared/utils';

import {
  StyledCheckbox,
  StyledHeadCell,
  StyledTableCell,
  StyledTableContainer,
} from './DataTable.styles';
import { DataTableItem, DataTableProps } from './DataTable.types';

const ROW_HEIGHT = 56;

export const VirtualizedDataTable = ({
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

  const handleSelect = useCallback(
    (item: DataTableItem, prevSelected: boolean) => {
      const key = getItemKey(item);

      if (onSelect) return onSelect(key, prevSelected);

      if (prevSelected) return setSelected(selected.filter((selectedKey) => selectedKey !== key));

      setSelected([...selected, key]);
    },
    [onSelect, selected],
  );

  const handleSelectAll = useCallback(() => {
    if (onSelectAll) return onSelectAll(isAllSelected);

    if (isAllSelected) return setSelected([]);

    setSelected(data?.map((item) => getItemKey(item)) ?? []);
  }, [data, isAllSelected, onSelectAll]);

  const renderRow = useCallback(
    ({ index, style }: { index: number; style: CSSProperties }) => {
      const item = data?.[index];
      if (!item) return null;

      const isItemSelected = selected?.includes(getItemKey(item));
      const rowTestId = `${dataTestid}-row-${index}`;

      return (
        <TableRow
          hover
          key={`data-table-row-${getEntityKey(item) || index}`}
          style={style}
          data-testid={rowTestId}
        >
          {selectable && (
            <TableCell sx={{ width: '2.8rem', backgroundColor: 'inherit' }}>
              <StyledCheckbox
                checked={isItemSelected}
                onChange={() => handleSelect(item, isItemSelected)}
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
    },
    [dataTableColumns, data, dataTestid, handleSelect, selectable, selected, tooltipByDefault],
  );

  if (!data?.length) {
    return (
      <TableRow className="empty-state">
        <TableCell sx={{ textAlign: 'left', backgroundColor: 'inherit' }}>
          <StyledLabelLarge>{noDataPlaceholder}</StyledLabelLarge>
        </TableCell>
      </TableRow>
    );
  }

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
              <StyledHeadCell
                tableHeadBackground={tableHeadBackground}
                sx={styles}
                key={`data-table-head-${key}`}
              >
                <StyledBodyMedium sx={{ color: variables.palette.outline }}>
                  {label}
                </StyledBodyMedium>
              </StyledHeadCell>
            ))}
          </TableRow>
        </TableHead>
      </Table>
      <Box sx={{ height: Math.min(400, data.length * ROW_HEIGHT + 2), width: '100%' }}>
        <AutoSizer>
          {({ height, width }: { height: number; width: number }) => (
            <List
              height={height}
              width={width}
              itemCount={data.length}
              itemSize={ROW_HEIGHT}
              overscanCount={5}
            >
              {renderRow}
            </List>
          )}
        </AutoSizer>
      </Box>
    </StyledTableContainer>
  );
};
