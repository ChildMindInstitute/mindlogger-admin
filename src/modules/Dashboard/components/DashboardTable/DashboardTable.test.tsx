import { screen, fireEvent } from '@testing-library/react';

import { createArray } from 'shared/utils';
import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { DashboardTable } from './DashboardTable';
import { DashboardTableProps } from './DashboardTable.types';

const mockColumns = [
  {
    id: 'firstName',
    label: 'First Name',
    enableSort: true,
  },
  {
    id: 'lastName',
    label: 'Last Name',
    enableSort: true,
  },
];

const actionsContentFn = jest.fn();

const getMockRows = (arrayLength = 15) =>
  createArray(arrayLength, (index) => ({
    firstName: {
      content: () => `John${index}`,
      value: `john-${index}`,
    },
    lastName: {
      content: () => `Doe${index}`,
      value: `doe-${index}`,
    },
    actions: {
      content: actionsContentFn,
      value: `actions-${index}`,
    },
  }));

const mockSortFn = jest.fn();
const mockChangePageFn = jest.fn();
const mockDataTestId = 'mockDataTestId';

const getTable = (props: Partial<DashboardTableProps> = {}) => (
  <DashboardTable
    columns={mockColumns}
    order="asc"
    orderBy=""
    rows={getMockRows()}
    handleRequestSort={mockSortFn}
    page={1}
    count={15}
    handleChangePage={mockChangePageFn}
    data-testid={mockDataTestId}
    rowsPerPage={10}
    {...props}
  />
);

describe('DashboardTable component tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render empty component for empty table', () => {
    const EmptyComponent = <>empty component</>;
    renderWithProviders(
      getTable({ rows: [], columns: [], count: 0, emptyComponent: EmptyComponent }),
    );

    expect(screen.getByText('empty component')).toBeInTheDocument();
  });

  test('should render table with rows', () => {
    renderWithProviders(getTable());

    const columns = ['First Name', 'Last Name'];
    const row = ['John1', 'Doe1'];
    expect(screen.getByTestId(`${mockDataTestId}-table-pagination`)).toBeInTheDocument();
    expect(screen.getByTestId(mockDataTestId)).toBeInTheDocument();
    columns.forEach((column) => expect(screen.getByText(column)).toBeInTheDocument());
    row.forEach((rowItem) => expect(screen.getByText(rowItem)).toBeInTheDocument());
  });

  test('should request table sort', () => {
    renderWithProviders(getTable());
    fireEvent.click(screen.getByText('First Name'));

    expect(mockSortFn).toBeCalledTimes(1);
  });

  test('should request change page', () => {
    renderWithProviders(getTable());
    fireEvent.click(screen.getByTitle('Go to next page'));

    expect(mockChangePageFn).toBeCalledTimes(1);
  });
});
