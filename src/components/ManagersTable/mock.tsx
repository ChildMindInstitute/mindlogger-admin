import { Button } from '@mui/material';
import TimeAgo from 'javascript-time-ago';

import { HeadCell, Row } from 'components/Table/Table.types';

export const headCells: HeadCell[] = [
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
  {
    id: 'role',
    label: 'Role',
  },
  {
    id: 'email',
    label: 'Email',
    enableSort: true,
  },
  {
    id: 'updated',
    label: 'Updated',
    enableSort: true,
  },
  {
    id: 'currentScheduleStatus',
    label: 'Current Schedule Selection',
  },
  {
    id: 'actions',
    label: 'Actions',
  },
];

export const getRowsCells = (timeAgo: TimeAgo): Row[] => [
  {
    firstName: {
      content: () => 'John',
      value: 'John',
    },
    lastName: {
      content: () => 'Doe',
      value: 'Doe',
    },
    role: {
      content: () => 'Owner',
      value: 'owner',
    },
    email: {
      content: () => 'johndoe@gmail.com',
      value: 'johndoe@gmail.com',
    },
    updated: {
      content: () => timeAgo.format(new Date(2022, 8, 21, 14, 32), 'round'),
      value: new Date(2022, 8, 21, 14, 32).getTime(),
    },
    currentScheduleStatus: {
      content: () => 'General Schedule',
      value: 'general',
    },
    actions: {
      content: () => <Button onClick={() => console.log('click')}>...</Button>,
      value: '',
    },
  },
  {
    firstName: {
      content: () => 'Jane',
      value: 'Jane',
    },
    lastName: {
      content: () => 'Doe',
      value: 'Doe',
    },
    role: {
      content: () => 'Manager',
      value: 'manager',
    },
    email: {
      content: () => 'janedoe@gmail.com',
      value: 'janedoe@gmail.com',
    },
    updated: {
      content: () => timeAgo.format(new Date(2022, 9, 2, 14, 32), 'round'),
      value: new Date(2022, 9, 2, 14, 32).getTime(),
    },
    currentScheduleStatus: {
      content: () => 'General Schedule',
      value: 'general',
    },
    actions: {
      content: () => <Button onClick={() => console.log('click')}>...</Button>,
      value: '',
    },
  },
];
