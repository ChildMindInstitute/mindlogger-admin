import { Button } from '@mui/material';
import TimeAgo from 'javascript-time-ago';

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

export const getRowsCells = (timeAgo: TimeAgo): Row[] => [
  {
    appletName: {
      content: () => 'Applet Name 1',
      value: 'Applet Name 1',
    },
    lastEdited: {
      content: () => timeAgo.format(new Date(2022, 8, 21, 14, 32), 'round'),
      value: new Date(2022, 8, 21, 14, 32).getTime(),
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
      content: () => timeAgo.format(new Date(2022, 10, 10, 10, 18), 'round'),
      value: new Date(2022, 10, 10, 10, 18).getTime(),
    },
    actions: {
      content: () => <Button onClick={() => console.log('click')}>Action</Button>,
      value: '',
    },
  },
];
