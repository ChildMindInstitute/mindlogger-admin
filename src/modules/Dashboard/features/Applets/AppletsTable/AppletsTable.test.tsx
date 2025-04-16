import { screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { mockedApplet, mockedAppletId, mockedCurrentWorkspace } from 'shared/mock';
import { Roles } from 'shared/consts';
import { initialStateData } from 'shared/state';

import { AppletsTable } from './AppletsTable';
import { getHeadCells } from '../Applets.const';
import { AppletsTableProps } from './AppletsTable.types';
import { AppletsContext } from '../Applets.context';

const preloadedState = {
  workspaces: {
    workspaces: initialStateData,
    currentWorkspace: {
      ...initialStateData,
      ...mockedCurrentWorkspace,
    },
    roles: {
      ...initialStateData,
      data: {
        [mockedAppletId]: [Roles.Manager],
      },
    },
    applet: mockedApplet,
    workspacesRoles: initialStateData,
  },
  applet: {
    applet: {
      ...initialStateData,
      data: { result: mockedApplet },
    },
  },
};

const appletsTablelTestId = 'dashboard-applets-table-test-id';

const mockedRows = [
  mockedApplet,
  {
    id: 'testId',
    name: 'testName',
    displayName: 'displayedName',
    isFolder: true,
    foldersAppletCount: 0,
  },
];

const mockContext = {
  rows: mockedRows,
  setRows: vi.fn(),
  expandedFolders: [],
  reloadData: vi.fn(),
  handleFolderClick: vi.fn(),
  fetchData: vi.fn(),
};

const getAppletsTable = (props: Partial<AppletsTableProps> = {}) => (
  <AppletsContext.Provider value={mockContext}>
    <AppletsTable
      data-testid={appletsTablelTestId}
      columns={getHeadCells()}
      rows={mockedRows}
      order="asc"
      orderBy=""
      emptyComponent={<>empty state</>}
      handleRequestSort={vi.fn()}
      page={1}
      count={2}
      rowsPerPage={30}
      handleChangePage={vi.fn()}
      headerContent={<>test header content</>}
      handleReload={vi.fn()}
      {...props}
    />
  </AppletsContext.Provider>
);

describe('AppletsTable component tests', () => {
  test('should render empty component', () => {
    renderWithProviders(getAppletsTable({ rows: [] }), { preloadedState });

    expect(screen.getByText('empty state')).toBeInTheDocument();
  });

  test('should render table with rows', () => {
    renderWithProviders(getAppletsTable(), { preloadedState });

    expect(screen.getByTestId(appletsTablelTestId)).toBeInTheDocument();
  });
});
