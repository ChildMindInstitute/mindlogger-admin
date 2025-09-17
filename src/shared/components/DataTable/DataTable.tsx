import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

import { StyledBodyMedium, StyledLabelLarge, variables } from 'shared/styles';
import { ContentWithTooltip } from 'shared/components/ContentWithTooltip';
import { getEntityKey } from 'shared/utils';

import { DataTableItem, DataTableProps } from './DataTable.types';
import {
  StyledCheckbox,
  StyledTableCell,
  StyledTableContainer,
  StyledHeadCell,
} from './DataTable.styles';

const CHECKBOX_COL_WIDTH = 48; // px; keep roomy to avoid overlap

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
      <Table stickyHeader sx={{ tableLayout: 'fixed', width: '100%' }}>
        <colgroup>
          {selectable ? <col style={{ width: `${CHECKBOX_COL_WIDTH}px` }} /> : null}
          {dataTableColumns?.map(({ key, styles = {} }) => (
            <col key={`col-${key}`} style={{ width: (styles as any)?.width }} />
          ))}
        </colgroup>
        <TableHead>
          <TableRow>
            {selectable ? (
              <StyledHeadCell
                tableHeadBackground={tableHeadBackground}
                sx={{
                  width: `${CHECKBOX_COL_WIDTH}px`,
                  minWidth: `${CHECKBOX_COL_WIDTH}px`,
                  maxWidth: `${CHECKBOX_COL_WIDTH}px`,
                  p: 0,
                  textAlign: 'center',
                }}
              >
                {selectAll && data?.length ? (
                  <StyledCheckbox
                    sx={{ m: 0 }}
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    disabled={!data?.length}
                    data-testid={`${dataTestid}-select-all`}
                  />
                ) : null}
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
        <TableBody>
          {data?.map((item, index) => {
            const isSelected = selected?.includes(getItemKey(item));

            return (
              <TableRow key={`data-table-row-${getEntityKey(item) || index}`}>
                {selectable && (
                  <TableCell
                    sx={{
                      width: `${CHECKBOX_COL_WIDTH}px`,
                      minWidth: `${CHECKBOX_COL_WIDTH}px`,
                      maxWidth: `${CHECKBOX_COL_WIDTH}px`,
                      backgroundColor: 'inherit',
                      p: 0,
                      textAlign: 'center',
                    }}
                  >
                    <StyledCheckbox
                      sx={{ m: 0 }}
                      checked={isSelected}
                      onChange={() => handleSelect(item, isSelected)}
                      data-testid={`${dataTestid}-checkbox-${index}`}
                    />
                  </TableCell>
                )}
                {dataTableColumns?.map(({ key, styles = {} }) => (
                  <StyledTableCell
                    sx={{ backgroundColor: 'inherit', ...styles }}
                    key={`data-table-cell-${key}`}
                  >
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
