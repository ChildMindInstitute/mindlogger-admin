import { useState } from 'react';
import { Modal } from '@mui/material';
import { Box } from '@mui/system';

import { Search, Svg } from 'components';
import theme from 'styles/theme';
import { variables } from 'styles/variables';

import { SelectedRespondent } from '../Legend.types';
import { searchItems } from './SearchPopup.const';
import {
  StyledModal,
  StyledItemsContainer,
  StyledItem,
  StyledClearBtn,
  StyledChecked,
} from './SearchPopup.styles';
import { SearchPopupProps } from './SearchPopup.types';
import { filterRows } from './SearchPopup.utils';

export const SearchPopup = ({
  open,
  onClose,
  top,
  left,
  setSelectedRespondent,
  selectedRespondent,
}: SearchPopupProps) => {
  const [searchValue, setSearchValue] = useState('');

  const selectedRespondentHandler = (item: SelectedRespondent) => {
    setSelectedRespondent(item);
    onClose();
  };

  const filteredRespondents = (items: SelectedRespondent[]) =>
    items?.filter(
      (item) => filterRows(item?.id, searchValue) || filterRows(item?.fullName, searchValue),
    );

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  return (
    <Modal
      style={{ position: 'absolute', width: '66rem', top, left }}
      open={open}
      onClose={onClose}
    >
      <StyledModal>
        <Search
          height="6.4rem"
          width="100%"
          background={variables.palette.surface2}
          placeholder="Search or select respondent to add/edit their schedule"
          endAdornment={
            <StyledClearBtn onClick={() => setSearchValue('')}>
              <Svg id="cross" />
            </StyledClearBtn>
          }
          value={searchValue}
          onSearch={handleSearch}
        />
        <StyledItemsContainer>
          {filteredRespondents(searchItems)?.map((item) => {
            const { id, fullName, icon } = item || {};
            const isSelected = id === selectedRespondent?.id;

            return (
              <StyledItem
                key={id}
                background={isSelected ? variables.palette.surface_variant : undefined}
                onClick={() => selectedRespondentHandler(item)}
              >
                {icon || null}
                <Box sx={{ marginLeft: theme.spacing(1.8) }}>
                  <strong>{id}</strong> ({fullName})
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
      </StyledModal>
    </Modal>
  );
};
