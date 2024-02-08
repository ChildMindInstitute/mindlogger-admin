import { render, fireEvent, screen } from '@testing-library/react';

import { DataTable } from './';

const mockData = [
  { id: '1', name: 'Item 1', tooltip: 'Tooltip 1' },
  { id: '2', name: 'Item 2', tooltip: 'Tooltip 2' },
];
const mockColumns = [{ key: 'name', label: 'Name' }];
const mockNoDataPlaceholder = 'No data available';
const dataTestid = 'data-table';
const commonProps = {
  data: mockData,
  columns: mockColumns,
  selectable: true,
  'data-testid': dataTestid,
};

describe('DataTable Component', () => {
  test('displays no data placeholder when data is empty', () => {
    render(<DataTable data={[]} columns={mockColumns} noDataPlaceholder={mockNoDataPlaceholder} />);

    expect(screen.getByText(mockNoDataPlaceholder)).toBeInTheDocument();
  });

  test('calls onSelect with correct parameters when a row is selected', () => {
    const onSelectMock = jest.fn();

    const { getByTestId } = render(<DataTable onSelect={onSelectMock} {...commonProps} />);

    const firstRowCheckbox = getByTestId(`${dataTestid}-checkbox-0`).childNodes[0];
    fireEvent.click(firstRowCheckbox);
    expect(onSelectMock).toHaveBeenCalledWith(mockData[0].id, false);
  });

  test('calls onSelectAll when the select all checkbox is clicked', () => {
    const onSelectAllMock = jest.fn();

    const { getByTestId } = render(<DataTable selectAll onSelectAll={onSelectAllMock} {...commonProps} />);

    const selectAllCheckbox = getByTestId(`${dataTestid}-select-all`).childNodes[0];
    fireEvent.click(selectAllCheckbox);
    expect(onSelectAllMock).toHaveBeenCalledWith(false);
  });

  test('updates selection state when selectedItems prop changes', () => {
    const { getByTestId } = render(<DataTable selectedItems={[mockData[0].id]} {...commonProps} />);

    const firstRowCheckbox = getByTestId(`${dataTestid}-checkbox-0`).childNodes[0];
    expect(firstRowCheckbox).toBeChecked();
  });
});
