import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

import { StyledBodyMedium, StyledLabelLarge, variables } from 'shared/styles';
import { getEntityKey } from 'shared/utils';
import { ContentWithTooltip } from 'shared/components';

import { DataTableProps } from './DataTable.types';
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
}: DataTableProps) => {
  const [selected, setSelected] = useState<(string | number)[]>(selectedItems || []);

  useEffect(() => {
    if (selectedItems) setSelected(selectedItems);
  }, [selectedItems]);

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
    <StyledTableContainer hasError={hasError}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {selectable && selectAll && (
              <TableCell sx={{ width: '2.8rem', backgroundColor: tableHeadBgColor }}>
                <StyledCheckbox
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  disabled={!data?.length}
                />
              </TableCell>
            )}
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
            const isSelected = selected?.includes(item.id);

            return (
              <TableRow key={`data-table-row-${getEntityKey(item) || index}`}>
                {selectable && (
                  <TableCell sx={{ width: '2.8rem', backgroundColor: 'inherit' }}>
                    <StyledCheckbox
                      checked={isSelected}
                      onChange={() => handleSelect(item.id, isSelected)}
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
            <TableRow>
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
