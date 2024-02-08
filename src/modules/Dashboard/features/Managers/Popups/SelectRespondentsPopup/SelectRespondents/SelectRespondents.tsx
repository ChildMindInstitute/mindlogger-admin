import { ChangeEvent, useEffect, useRef, useState } from 'react';

import { useFormContext } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';

import { Row, Search, Table, UiType } from 'shared/components';
import { CheckboxController } from 'shared/components/FormComponents';
import { StyledBodyMedium, theme, variables } from 'shared/styles';

import { getSelectedRespondentsLength } from '../SelectRespondentsPopup.utils';
import { Select } from './Select';
import { options, SearchAcross } from './SelectRespondents.const';
import { StyledFilterContainer, StyledSelectContainer } from './SelectRespondents.styles';
import { SelectRespondentsProps } from './SelectRespondents.types';
import { filterTableRows, getHeadCells } from './SelectRespondents.utils';

export const SelectRespondents = ({ reviewer: { name, email }, appletName, respondents }: SelectRespondentsProps) => {
  const { t } = useTranslation('app');
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [tableRows, setTableRows] = useState<Row[] | null>(null);
  const searchAcrossValue = useRef<string>(SearchAcross.All);
  const searchValue = useRef<string>('');

  const setSearchAcrossValue = (value: string) => {
    searchAcrossValue.current = value;
  };

  const setSearchValue = (value: string) => {
    searchValue.current = value;
  };

  const rows = respondents?.map(({ secretId, nickname, id }, index) => ({
    select: {
      content: () => (
        <CheckboxController
          key={id}
          control={control}
          name={id}
          value={id}
          label={<></>}
          onCustomChange={event => {
            filterTableRows(
              searchAcrossValue.current,
              { ...getValues(), [id]: event.target.checked },
              searchValue.current,
              setTableRows,
              rows,
            );
          }}
          data-testid={`dashboard-managers-select-respondents-respondent-${index}`}
        />
      ),
      value: id,
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

  const { control, setValue, getValues, watch } = useFormContext();
  const formValues = watch();

  const handleSearch = (value: string) => {
    setSearchValue(value);
    filterTableRows(searchAcrossValue.current, getValues(), value, setTableRows, rows);
  };

  const handleFilterChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setSearchAcrossValue(value);
    filterTableRows(value, getValues(), searchValue.current, setTableRows, rows);
  };

  const handleSelectAllClick = async ({ target: { checked } }: ChangeEvent<HTMLInputElement>) => {
    setSelectAllChecked(checked);
    await respondents.forEach(({ id }) => {
      setValue(id, checked);
    });
    filterTableRows(searchAcrossValue.current, getValues(), searchValue.current, setTableRows, rows);
  };

  const selectedRespondentsLength = getSelectedRespondentsLength(formValues);

  const renderSelectedRespondents = () =>
    selectedRespondentsLength
      ? `${t('respondentsSelected', { count: selectedRespondentsLength })}`
      : `${t('selectRespondentsHint')}`;

  const renderEmptyComponent = () => {
    if (!respondents.length) {
      return t('noRespondents');
    }
    if (searchValue.current) {
      return t('noMatchWasFound', { searchValue: searchValue.current });
    }
    if (searchAcrossValue.current !== SearchAcross.All) {
      return t('noData');
    }
  };

  useEffect(() => {
    if (!respondents) return;

    setTableRows(rows);
  }, [respondents]);

  useEffect(() => {
    setSelectAllChecked(selectedRespondentsLength === respondents.length);
  }, [formValues]);

  return (
    <>
      <StyledBodyMedium>
        <Trans i18nKey="selectRespondentsDescription">
          Give
          <b>
            <>
              {{ name }} ({{ email }})
            </>
          </b>
          access to review the data for the Applet
          <b>
            <>{{ appletName }}</>
          </b>
          for the following Respondents:
        </Trans>
      </StyledBodyMedium>
      <StyledFilterContainer>
        <Search
          withDebounce
          placeholder={t('searchRespondents')}
          onSearch={handleSearch}
          data-testid="dashboard-select-respondents-search"
        />
        <StyledSelectContainer>
          <Select
            label={'searchAcross'}
            options={options}
            onChange={handleFilterChange}
            value={searchAcrossValue.current}
            data-testid="select-respondents-popup-search-across"
          />
        </StyledSelectContainer>
      </StyledFilterContainer>
      <form noValidate>
        <Table
          maxHeight="32.4rem"
          columns={getHeadCells(handleSelectAllClick, selectAllChecked)}
          rows={tableRows || []}
          orderBy={'nickname'}
          uiType={UiType.Secondary}
          emptyComponent={renderEmptyComponent()}
        />
      </form>
      <StyledBodyMedium sx={{ marginTop: theme.spacing(1.2), color: variables.palette.on_surface_variant }}>
        {renderSelectedRespondents()}
      </StyledBodyMedium>
    </>
  );
};
