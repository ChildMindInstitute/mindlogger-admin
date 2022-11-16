import { Button } from '@mui/material';
import { HeadCell, Row } from 'components/Table/Table.types';

export const headCells: HeadCell[] = [
  {
    id: 'appletName',
    label: 'Applet Name',
    enableSort: true,
  },
  {
    id: 'lastEdited',
    label: 'Last Edited',
    enableSort: true,
  },
  {
    id: 'actions',
    label: 'Actions',
  },
];

export const rowsCells: Row[] = [
  {
    appletName: {
      content: () => 'Applet Name 1',
      value: 'Applet Name 1',
    },
    lastEdited: {
      content: () => new Date().toUTCString(),
      value: new Date().toUTCString(),
    },
    actions: {
      content: () => <Button onClick={() => console.log('click')}>Action</Button>,
      value: '',
    },
  },
  {
    appletName: {
      content: () => 'Applet Name 2',
      value: 'Applet Name 2',
    },
    lastEdited: {
      content: () => new Date(2022, 11, 10).toUTCString(),
      value: new Date(2022, 11, 10).toUTCString(),
    },
    actions: {
      content: () => <Button onClick={() => console.log('click')}>Action</Button>,
      value: '',
    },
  },
];
