import { ChangeEvent, forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';

import { CheckboxController } from 'shared/components/FormComponents';
import { Row, Table, UiType, Search } from 'shared/components';
import { filterRows } from 'shared/utils';
import { StyledBodyMedium, theme, variables } from 'shared/styles';

import { SelectRespondentsProps, SelectRespondentsRef } from './SelectRespondents.types';
import { StyledFilterContainer, StyledSelectContainer } from './SelectRespondents.styles';
import { options, SearchAcross } from './SelectRespondents.const';
import { getHeadCells } from './SelectRespondents.utils';
import { Select } from './Select';

export const SelectRespondents = forwardRef<SelectRespondentsRef, SelectRespondentsProps>(
  ({ reviewer: { name, email }, appletName, selectedRespondents, respondents }, ref) => {
    const { t } = useTranslation('app');
    const [searchAcrossValue, setSearchAcrossValue] = useState<string>(SearchAcross.All);
    const [searchValue, setSearchValue] = useState('');
    const [selectAllChecked, setSelectAllChecked] = useState(false);

    const { control, getValues, setValue, watch } = useForm({});
    const formValues = watch();

    const rows = respondents?.map(({ secretId, nickname, id }) => ({
      select: {
        content: () => <CheckboxController control={control} name={id} value={id} label={<></>} />,
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
    const [tableRows, setTableRows] = useState<Row[] | null>(null);

    const handleSearch = (value: string) => {
      setSearchValue(value);
    };

    const handleFilterChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
      setSearchAcrossValue(value);
    };

    const handleSelectAllClick = ({ target: { checked } }: ChangeEvent<HTMLInputElement>) => {
      setSelectAllChecked(checked);
      respondents.forEach(({ id }) => {
        setValue(id, checked);
      });
    };

    const getSelectedRespondentsList = () =>
      Object.keys(getValues()).filter((respondent) => formValues[respondent]);

    const selectedRespondentsLength = getSelectedRespondentsList().length;

    const renderSelectedRespondents = () =>
      selectedRespondentsLength
        ? `${t('respondentsSelected', { count: selectedRespondentsLength })}`
        : `${t('selectRespondentsHint')}`;

    const renderEmptyComponent = () => {
      if (!respondents.length) {
        return t('noRespondents');
      }
      if (searchValue) {
        return t('noMatchWasFound', { searchValue });
      }
      if (searchAcrossValue !== SearchAcross.All) {
        return t('noData');
      }
    };

    useImperativeHandle(ref, () => ({
      confirmSelection() {
        return getSelectedRespondentsList();
      },
    }));

    useEffect(() => {
      if (!respondents) return;
      respondents.forEach(({ id }) => {
        setValue(id, selectedRespondents.includes(id));
      });
      setTableRows(rows);
    }, [respondents]);

    useEffect(() => {
      const selectedRespondents = Object.values(formValues).filter(Boolean);
      setSelectAllChecked(selectedRespondents.length === respondents.length);
    }, [formValues]);

    useEffect(() => {
      const selectFilter = ({ select }: Row) => {
        const id = select.value as string;
        switch (searchAcrossValue) {
          case SearchAcross.Unselected:
            return !getValues()[id];
          case SearchAcross.Selected:
            return getValues()[id];
          default:
            return true;
        }
      };
      const searchFilter = ({ secretId, nickname }: Row) =>
        filterRows(secretId, searchValue) || filterRows(nickname, searchValue);
      const filteredRows = rows?.filter(selectFilter)?.filter(searchFilter);
      setTableRows(filteredRows);
    }, [searchAcrossValue, searchValue]);

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
            maxHeight="32.4rem"
            columns={getHeadCells(handleSelectAllClick, selectAllChecked)}
            rows={tableRows || []}
            orderBy={'nickname'}
            uiType={UiType.Secondary}
            emptyComponent={renderEmptyComponent()}
          />
        </form>
        <StyledBodyMedium
          sx={{ marginTop: theme.spacing(1.2), color: variables.palette.on_surface_variant }}
        >
          {renderSelectedRespondents()}
        </StyledBodyMedium>
      </>
    );
  },
);
