import { ChangeEvent, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';

import { CheckboxController } from 'shared/components/FormComponents';
import { Row, Search, Table, UiType } from 'shared/components';
import { StyledBodyMedium, theme, variables } from 'shared/styles';

import { SelectRespondentsProps, SelectRespondentsRef } from './SelectRespondents.types';
import { StyledFilterContainer, StyledSelectContainer } from './SelectRespondents.styles';
import { options, SearchAcross } from './SelectRespondents.const';
import { filterTableRows, getHeadCells } from './SelectRespondents.utils';
import { Select } from './Select';

export const SelectRespondents = forwardRef<SelectRespondentsRef, SelectRespondentsProps>(
  ({ reviewer: { name, email }, appletName, selectedRespondents, respondents }, ref) => {
    const { t } = useTranslation('app');
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const [tableRows, setTableRows] = useState<Row[] | null>(null);
    const searchAcrossValue = useRef<string>(SearchAcross.All);
    const setSearchAcrossValue = (value: string) => {
      searchAcrossValue.current = value;
    };
    const searchValue = useRef<string>('');
    const setSearchValue = (value: string) => {
      searchValue.current = value;
    };
    const { control, getValues, setValue, watch } = useForm();

    const formValues = watch();
    const rows = respondents?.map(({ secretId, nickname, id }) => ({
      select: {
        content: () => (
          <CheckboxController
            key={id}
            control={control}
            name={id}
            value={id}
            label={<></>}
            onCustomChange={(event) => {
              filterTableRows(
                searchAcrossValue.current,
                { ...getValues(), [id]: event.target.checked },
                searchValue.current,
                setTableRows,
                rows,
              );
            }}
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
      filterTableRows(
        searchAcrossValue.current,
        getValues(),
        searchValue.current,
        setTableRows,
        rows,
      );
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
      if (searchValue.current) {
        return t('noMatchWasFound', { searchValue });
      }
      if (searchAcrossValue.current !== SearchAcross.All) {
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
              value={searchAcrossValue.current}
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
