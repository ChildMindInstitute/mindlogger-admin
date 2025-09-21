import { Box, styled, Table, TableCell, TableHead, TableRow } from '@mui/material';
import { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';

import { ContentWithTooltip } from 'shared/components/ContentWithTooltip';
import { StyledBodyMedium, StyledLabelLarge, variables } from 'shared/styles';
import { getEntityKey } from 'shared/utils';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

import { StyledCheckbox, StyledHeadCell, StyledTableCell } from './DataTable.styles';
import { DataTableItem, DataTableProps } from './DataTable.types';

// Styled container for virtualized tables without fixed height constraints
const StyledVirtualizedContainer = styled(Box, shouldForwardProp)`
  border: ${({ hasError }: { hasError?: boolean }) =>
    hasError
      ? `${variables.borderWidth.lg} solid ${variables.palette.error};`
      : `${variables.borderWidth.md} solid ${variables.palette.outline_variant};`};
  border-radius: ${variables.borderRadius.lg2};
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 29.2rem;
  max-height: 29.2rem;
  overflow: hidden; /* clip sticky header to rounded corners, prevent gaps */
  background-color: ${variables.palette.surface1};

  .MuiTable-root {
    table-layout: fixed;
    width: 100%;
  }

  .MuiTableCell-root {
    background-color: transparent;
    height: 4.8rem;
  }
`;

const ROW_HEIGHT = 56;

// Stable outer scroller to suppress horizontal scrollbar inside the virtualized list
const OuterNoXScroll = styled('div')`
  overflow-x: hidden !important;
  overflow-y: auto;
  width: 100%;
  height: 100%;
`;

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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const headerCellRefs = useRef<(HTMLTableCellElement | null)[]>([]);
  const [colWidths, setColWidths] = useState<number[]>([]);

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

  // Measure header cell widths and propagate to row cells so virtualization matches header
  const measureHeader = useCallback(() => {
    const raw = headerCellRefs.current.map((el) => el?.getBoundingClientRect().width || 0);
    // Subtract a small fudge to avoid fractional rounding creating overflow
    const FUDGE_TOTAL = 8; // px
    const widths = raw.map((w, i) => {
      const subtract = i === raw.length - 1 ? FUDGE_TOTAL : 1;

      return Math.max(0, w - subtract);
    });

    setColWidths(widths);
  }, []);

  useEffect(() => {
    measureHeader();
  }, [measureHeader, dataTableColumns, selectable]);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(() => measureHeader());
    ro.observe(containerRef.current);

    return () => ro.disconnect();
  }, [measureHeader]);

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
            <TableCell
              sx={{
                width: '48px',
                minWidth: '48px',
                maxWidth: '48px',
                backgroundColor: 'inherit',
                p: 0,
                textAlign: 'center',
              }}
            >
              <StyledCheckbox
                sx={{ m: 0 }}
                checked={isItemSelected}
                onChange={() => handleSelect(item, isItemSelected)}
                data-testid={`${dataTestid}-checkbox-${index}`}
              />
            </TableCell>
          )}
          {dataTableColumns?.map(({ key, styles = {} }, ci) => (
            <StyledTableCell
              sx={{
                backgroundColor: 'inherit',
                ...styles,
                ...(colWidths[ci] && {
                  width: `${colWidths[ci]}px`,
                  maxWidth: `${colWidths[ci]}px`,
                }),
              }}
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
    },
    [
      colWidths,
      dataTableColumns,
      data,
      dataTestid,
      handleSelect,
      selectable,
      selected,
      tooltipByDefault,
    ],
  );

  return (
    <StyledVirtualizedContainer hasError={hasError} data-testid={dataTestid} ref={containerRef}>
      <Table stickyHeader sx={{ flexShrink: 0, tableLayout: 'fixed', width: '100%' }}>
        <colgroup>
          {selectable ? <col style={{ width: '48px' }} /> : null}
          {dataTableColumns?.map(({ key, styles = {} }) => (
            <col key={`col-${key}`} style={{ width: (styles as CSSProperties)?.width }} />
          ))}
        </colgroup>
        <TableHead>
          <TableRow>
            {selectable ? (
              <StyledHeadCell
                tableHeadBackground={tableHeadBackground}
                sx={{
                  width: '48px',
                  minWidth: '48px',
                  maxWidth: '48px',
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
            {dataTableColumns?.map(({ key, label, styles = {} }, i) => (
              <StyledHeadCell
                tableHeadBackground={tableHeadBackground}
                sx={styles}
                key={`data-table-head-${key}`}
                ref={(el: HTMLTableCellElement | null) => (headerCellRefs.current[i] = el)}
              >
                <StyledBodyMedium sx={{ color: variables.palette.outline }}>
                  {label}
                </StyledBodyMedium>
              </StyledHeadCell>
            ))}
          </TableRow>
        </TableHead>
      </Table>
      <Box sx={{ flexGrow: 1, width: '100%', overflow: 'hidden' }}>
        {!data?.length ? (
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', height: '100%' }}>
            <StyledLabelLarge>{noDataPlaceholder}</StyledLabelLarge>
          </Box>
        ) : (
          <AutoSizer>
            {({ height, width }: { height: number; width: number }) => (
              <List
                height={height}
                width={width}
                itemCount={data.length}
                itemSize={ROW_HEIGHT}
                overscanCount={5}
                outerElementType={OuterNoXScroll}
              >
                {renderRow}
              </List>
            )}
          </AutoSizer>
        )}
      </Box>
    </StyledVirtualizedContainer>
  );
};
