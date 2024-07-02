import { screen } from '@testing-library/react';

import { renderComponentForEachTest } from 'shared/utils/renderComponentForEachTest';

import { Table } from './Table';

const columns = [
  {
    id: 'appletName',
    label: 'Applet Name',
    enableSort: true,
  },
];

const rows = [
  {
    id: {
      content: () => `id-should-be-hidden`,
      value: '1',
      isHidden: true,
    },
    appletName: {
      content: () => 'test',
      value: 'test',
    },
  },
];

describe('Table component tests', () => {
  renderComponentForEachTest(<Table columns={columns} rows={rows} orderBy={'appletName'} />);

  test('Table should render rows with only visible columns', async () => {
    const table = await screen.findByRole('table');
    const rows = await screen.findAllByTestId('table-row');

    expect(table).toBeInTheDocument();
    expect(rows.length).toBe(1);
    expect(screen.queryByText('id-should-be-hidden')).not.toBeInTheDocument();
  });
});
