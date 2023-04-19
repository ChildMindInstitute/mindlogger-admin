import { useState, useEffect } from 'react';
import { Checkbox, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

import { StyledBodyMedium, StyledFlexColumn, StyledLabelLarge, variables } from 'shared/styles';

import { DataTableProps } from './DataTable.types';
import { getColumns } from './DataTable.utils';
import { StyledTableContainer } from './DataTable.styles';

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
  styles = {},
}: DataTableProps) => {
  const [selected, setSelected] = useState<(string | number)[]>(selectedItems || []);

  useEffect(() => {
    if (selectedItems) setSelected(selectedItems);
  }, [selectedItems]);

  const columns = getColumns(dataTableColumns);

  const isAllSelected = data?.length !== 0 && selected?.length === data?.length;

  const handleSelect = (key: string | number, prevSelected: boolean) => {
    if (onSelect) return onSelect(key, prevSelected);

    if (prevSelected) return setSelected(selected.filter((selectedKey) => selectedKey !== key));

    setSelected([...selected, key]);
  };

  const handleSelectAll = () => {
    if (onSelectAll) return onSelectAll(isAllSelected);

    if (isAllSelected) return setSelected([]);

    setSelected(data?.map(({ id }) => id) ?? []);
  };

  return (
    <StyledTableContainer hasError={hasError} sx={{ ...styles }}>
      <StyledFlexColumn>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {selectable && selectAll && (
                <TableCell sx={{ width: '2.8rem', backgroundColor: 'inherit' }}>
                  <Checkbox
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    disabled={!data?.length}
                  />
                </TableCell>
              )}
              {columns?.map(({ key, label }) => (
                <TableCell sx={{ backgroundColor: 'inherit' }} key={`data-table-head-${key}`}>
                  <StyledBodyMedium sx={{ color: variables.palette.outline }}>
                    {label}
                  </StyledBodyMedium>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((item, index) => {
              const isSelected = selected?.includes(item.id);

              return (
                <TableRow key={`data-table-row-${index}`}>
                  {selectable && (
                    <TableCell sx={{ width: '2.8rem', backgroundColor: 'inherit' }}>
                      <Checkbox
                        key={`data-table-cell-checkbox-${isSelected}`}
                        checked={isSelected}
                        onChange={() => handleSelect(item.id, isSelected)}
                      />
                    </TableCell>
                  )}
                  {columns?.map(({ key, formatter }) => (
                    <TableCell sx={{ backgroundColor: 'inherit' }} key={`data-table-cell-${key}`}>
                      {formatter(key, item[key], item)}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
            {!data?.length && (
              <TableRow>
                <TableCell sx={{ textAlign: 'left' }}>
                  <StyledLabelLarge>{noDataPlaceholder}</StyledLabelLarge>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </StyledFlexColumn>
    </StyledTableContainer>
  );
};
