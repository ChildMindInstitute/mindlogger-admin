import { HeadCell } from 'types/table';

export const headCells: HeadCell[] = [
  {
    id: 'name',
    label: 'Applet Name',
    enableSort: true,
    width: '30%',
  },
  {
    id: 'updated',
    label: 'Last Edited',
    enableSort: true,
    width: '15%',
  },
  {
    id: 'actions',
    label: 'Actions',
    align: 'right',
  },
];
