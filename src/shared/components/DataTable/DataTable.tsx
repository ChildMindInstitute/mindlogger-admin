import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

import { StyledBodyMedium, StyledLabelLarge, variables } from 'shared/styles';
import { getEntityKey } from 'shared/utils';
import { ContentWithTooltip } from 'shared/components/ContentWithTooltip';

import { DataTableItem, DataTableProps } from './DataTable.types';
import { StyledCheckbox, StyledTableCell, StyledTableContainer } from './DataTable.styles';

//TODO: add pagination, sort
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
  tableHeadBgColor = variables.palette.surface1,
  isValueName = false,
}: DataTableProps) => {
  const [selected, setSelected] = useState<(string | number)[]>(selectedItems || []);

  const getItemKey = (item: DataTableItem) => (isValueName ? item.name || '' : item.id);

  useEffect(() => {
    if (selectedItems) setSelected(selectedItems);
  }, [selectedItems]);

  const isAllSelected = data?.length !== 0 && selected?.length === data?.length;

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
    <StyledTableContainer hasError={hasError}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {selectable && selectAll && data?.length ? (
              <TableCell sx={{ width: '2.8rem', backgroundColor: tableHeadBgColor }}>
                <StyledCheckbox
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  disabled={!data?.length}
                />
              </TableCell>
            ) : null}
            {dataTableColumns?.map(({ key, label, styles = {} }) => (
              <TableCell
                sx={{ ...styles, backgroundColor: tableHeadBgColor }}
                key={`data-table-head-${key}`}
              >
                <StyledBodyMedium sx={{ color: variables.palette.outline }}>
                  {label}
                </StyledBodyMedium>
              </TableCell>
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
                    />
                  </TableCell>
                )}
                {dataTableColumns?.map(({ key }) => (
                  <StyledTableCell
                    sx={{ backgroundColor: 'inherit' }}
                    key={`data-table-cell-${key}`}
                  >
                    <ContentWithTooltip value={item[key]} item={item} />
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
