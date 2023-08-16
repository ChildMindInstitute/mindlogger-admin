import { ChangeEvent } from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';
import i18n from 'i18n';

import { HeadCell } from 'shared/types/table';

export const getHeadCells = (
  onSelectAllClick: (event: ChangeEvent<HTMLInputElement>) => void,
  selectAllChecked: boolean,
): HeadCell[] => {
  const { t } = i18n;

  return [
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
};
