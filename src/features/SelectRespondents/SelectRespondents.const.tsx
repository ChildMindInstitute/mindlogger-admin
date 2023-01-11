import { ChangeEvent } from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';
import { TFunction } from 'i18next';

import { HeadCell } from 'types/table';

export enum SearchAcross {
  all = 'all',
  selected = 'selected',
  unselected = 'unselected',
}

export const options = [
  { label: SearchAcross.all, value: SearchAcross.all },
  { label: SearchAcross.selected, value: SearchAcross.selected },
  { label: SearchAcross.unselected, value: SearchAcross.unselected },
];

export const getHeadCells = (
  onSelectAllClick: (event: ChangeEvent<HTMLInputElement>) => void,
  selectAllChecked: boolean,
  t: TFunction,
): HeadCell[] => [
  {
    id: 'select',
    label: (
      <FormControlLabel
        control={<Checkbox checked={selectAllChecked} onChange={onSelectAllClick} />}
        label=""
      />
    ),
    enableSort: false,
    width: '48',
  },
  {
    id: 'secretId',
    label: t('all'),
    enableSort: false,
  },
  {
    id: 'nickname',
    label: '',
    enableSort: false,
  },
];
