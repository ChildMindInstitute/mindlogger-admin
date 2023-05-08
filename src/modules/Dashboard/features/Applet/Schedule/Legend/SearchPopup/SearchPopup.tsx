import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { generatePath, useNavigate, useParams } from 'react-router-dom';

import { Search, Svg } from 'shared/components';
import { theme, variables } from 'shared/styles';
import { page } from 'resources';
import { getRespondentName } from 'shared/utils';

import { AddIndividualSchedulePopup } from '../../AddIndividualSchedulePopup';
import { SelectedRespondent } from '../Legend.types';
import { ScheduleOptions } from '../Legend.const';
import {
  StyledModal,
  StyledModalInner,
  StyledItemsContainer,
  StyledItem,
  StyledClearBtn,
  StyledChecked,
} from './SearchPopup.styles';
import { SearchPopupProps } from './SearchPopup.types';
import { filterRows } from './SearchPopup.utils';

export const SearchPopup = ({
  open,
  setSearchPopupVisible,
  setSchedule,
  top,
  left,
  setSelectedRespondent,
  selectedRespondent,
  respondentsItems,
}: SearchPopupProps) => {
  const { t } = useTranslation('app');
  const navigate = useNavigate();
  const { appletId } = useParams();

  const [searchValue, setSearchValue] = useState('');
  const [addIndividualSchedulePopupVisible, setAddIndividualSchedulePopupVisible] = useState(false);

  const respondentName = getRespondentName(
    selectedRespondent?.secretId || '',
    selectedRespondent?.nickname,
  );

  const handleSearchPopupClose = () => {
    !selectedRespondent && setSchedule(ScheduleOptions.DefaultSchedule);
    setSearchPopupVisible(false);
  };

  const selectedRespondentHandler = (item: SelectedRespondent) => {
    const { id: respondentId, hasIndividualSchedule } = item || {};
    setSelectedRespondent(item);
    if (hasIndividualSchedule) {
      navigate(
        generatePath(page.appletScheduleIndividual, {
          appletId,
          respondentId,
        }),
      );
    } else {
      setAddIndividualSchedulePopupVisible(true);
    }
    setSearchPopupVisible(false);
  };

  const filteredRespondents = (items: SelectedRespondent[]) =>
    items.filter(
      (item) => filterRows(item?.secretId, searchValue) || filterRows(item?.nickname, searchValue),
    );

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const handleAddIndividualScheduleSubmit = () => {
    const { id: respondentId } = selectedRespondent || {};
    navigate(
      generatePath(page.appletScheduleIndividual, {
        appletId,
        respondentId,
      }),
    );
    setAddIndividualSchedulePopupVisible(false);
  };

  const handleAddIndividualScheduleClose = () => {
    setAddIndividualSchedulePopupVisible(false);
    setSearchPopupVisible(true);
    setSelectedRespondent(null);
  };

  return (
    <>
      <StyledModal style={{ top, left }} open={open} onClose={handleSearchPopupClose}>
        <StyledModalInner>
          <Search
            height="6.4rem"
            width="100%"
            background={variables.palette.surface2}
            placeholder={t('searchOrSelectRespondent')}
            endAdornment={
              <StyledClearBtn onClick={handleSearchPopupClose}>
                <Svg id="cross" />
              </StyledClearBtn>
            }
            onSearch={handleSearch}
          />
          <StyledItemsContainer>
            {respondentsItems &&
              filteredRespondents(respondentsItems)?.map((item) => {
                const { id, secretId, nickname, icon } = item || {};
                const isSelected = id === selectedRespondent?.id;

                return (
                  <StyledItem
                    key={id}
                    background={isSelected ? variables.palette.surface_variant : undefined}
                    onClick={() => selectedRespondentHandler(item)}
                  >
                    {icon || <Box sx={{ width: '2.4rem' }} />}
                    <Box sx={{ ml: theme.spacing(1.8) }}>
                      <strong>{secretId}</strong>
                      {nickname ? ` (${nickname})` : ''}
                    </Box>
                    {isSelected && (
                      <StyledChecked>
                        <Svg id="check" />
                      </StyledChecked>
                    )}
                  </StyledItem>
                );
              })}
          </StyledItemsContainer>
        </StyledModalInner>
      </StyledModal>
      {addIndividualSchedulePopupVisible && (
        <AddIndividualSchedulePopup
          open={addIndividualSchedulePopupVisible}
          onClose={handleAddIndividualScheduleClose}
          onSubmit={handleAddIndividualScheduleSubmit}
          respondentName={respondentName}
        />
      )}
    </>
  );
};
