import { ChangeEvent, Dispatch, SetStateAction } from 'react';

import { Checkbox, FormControlLabel } from '@mui/material';

import i18n from 'i18n';
import { filterRows } from 'modules/Dashboard/utils';
import { Row } from 'shared/components';
import { HeadCell } from 'shared/types/table';

import { SearchAcross } from './SelectRespondents.const';

export const getHeadCells = (
  onSelectAllClick: (event: ChangeEvent<HTMLInputElement>) => void,
  selectAllChecked: boolean,
): HeadCell[] => {
  const { t } = i18n;

  return [
    {
      id: 'select',
      label: (
        <FormControlLabel control={<Checkbox checked={selectAllChecked} onChange={onSelectAllClick} />} label="" />
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

export const filterTableRows = (
  searchAcrossValue: string,
  formValues: Row,
  searchValue: string,
  setTableRows: Dispatch<SetStateAction<Row[] | null>>,
  rows?: Row[],
) => {
  const selectFilter = ({ select }: Row) => {
    const id = select.value as string;
    switch (searchAcrossValue) {
      case SearchAcross.Unselected:
        return !formValues[id];
      case SearchAcross.Selected:
        return formValues[id];
      default:
        return true;
    }
  };
  const searchFilter = ({ secretId, nickname }: Row) =>
    filterRows(secretId, searchValue) || filterRows(nickname, searchValue);
  const filteredRows = rows?.filter(selectFilter)?.filter(searchFilter);
  setTableRows(filteredRows || null);
};
