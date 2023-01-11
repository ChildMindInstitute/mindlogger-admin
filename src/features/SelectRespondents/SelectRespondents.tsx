import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';

import { CheckboxController } from 'components/FormComponents';
import { Search } from 'components/Search';
import { Table } from 'components/Tables';
import { filterRows } from 'utils/filterRows';
import { StyledBodyMedium } from 'styles/styledComponents/Typography';
import { variables } from 'styles/variables';

import { SelectRespondentsProps } from './SelectRespondents.types';
import { StyledFilterContainer, StyledSelectContainer } from './SelectRespondents.styles';
import { getHeadCells, options, SearchAcross } from './SelectRespondents.const';
import { Select } from './Select';

export const SelectRespondents = ({
  reviewer,
  appletName,
  selectedRespondents,
  respondents,
}: SelectRespondentsProps) => {
  const { t } = useTranslation('app');
  const [searchAcrossValue, setSearchAcrossValue] = useState<string>(SearchAcross.all);
  const [searchValue, setSearchValue] = useState('');
  const [selectAllChecked, setSelectAllChecked] = useState(
    selectedRespondents.length === respondents.length,
  );

  const defaultValues = respondents.reduce(
    (values, { secretId }) => ({ ...values, [secretId]: selectedRespondents.includes(secretId) }),
    {},
  ) as { [key: string]: boolean };

  const { control, getValues, setValue } = useForm({ defaultValues });

  const rows = respondents?.map(({ secretId, nickname }) => ({
    select: {
      content: () => <CheckboxController control={control} name={secretId} label={<></>} />,
      value: secretId,
    },
    secretId: {
      content: () => secretId,
      value: secretId,
    },
    nickname: {
      content: () => nickname,
      value: nickname,
    },
  }));

  const [tableRows, setTableRows] = useState(rows);

  useEffect(() => {
    const filteredRows = rows
      ?.filter(({ select }) => {
        switch (searchAcrossValue) {
          case SearchAcross.unselected:
            return !getValues()[select.value];
          case SearchAcross.selected:
            return getValues()[select.value];
          default:
            return true;
        }
      })
      .filter(
        ({ secretId, nickname }) =>
          filterRows(secretId, searchValue) || filterRows(nickname, searchValue),
      );
    setTableRows(filteredRows);
  }, [searchAcrossValue, searchValue]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const handleSelectAllClick = ({ target: { checked } }: ChangeEvent<HTMLInputElement>) => {
    setSelectAllChecked(checked);
    respondents.forEach(({ secretId }) => {
      setValue(secretId, checked);
    });
  };

  const handleFilterChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setSearchAcrossValue(value);
  };

  return (
    <>
      <StyledBodyMedium
        dangerouslySetInnerHTML={{
          __html: t('selectRespondentsDescription', {
            reviewerName: reviewer.name,
            reviewerEmail: reviewer.email,
            appletName,
          }),
        }}
      />
      <StyledFilterContainer>
        <Search placeholder={t('searchRespondents')} onSearch={handleSearch} />
        <StyledSelectContainer>
          <Select
            label={'searchAcross'}
            options={options}
            onChange={handleFilterChange}
            value={searchAcrossValue}
          />
        </StyledSelectContainer>
      </StyledFilterContainer>
      <form noValidate>
        <Table
          tableHeight="32.4rem"
          columns={getHeadCells(handleSelectAllClick, selectAllChecked, t)}
          rows={tableRows}
          orderBy={'nickname'}
          hidePagination
          headBackground={variables.palette.surface3}
        />
      </form>
    </>
  );
};
