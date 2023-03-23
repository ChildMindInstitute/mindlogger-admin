import { ChangeEvent, MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, FieldValues } from 'react-hook-form';
import { TextField, FormControl, InputLabel } from '@mui/material';

import { Svg } from 'shared/components';
import { theme, StyledClearedButton, StyledFlexTopCenter } from 'shared/styles';
import { ItemInputTypes } from 'shared/types';
import { falseReturnFunc } from 'shared/utils';

import { itemsTypeIcons } from '../ItemConfiguration.const';
import { GroupedSelectControllerProps } from './GroupedSelectSearchController.types';
import {
  StyledMenuItem,
  StyledListSubheader,
  StyledSelect,
} from './GroupedSelectSearchController.styles';
import { ItemTypeTooltip } from './ItemTypeTooltip';
import { selectDropdownStyles } from './GroupedSelectSearchController.const';
import {
  handleSearchKeyDown,
  getIsNotHaveSearchValue,
  getEmptyComponent,
  getGroupName,
  getGroupValueText,
} from './GroupedSelectSearchController.utils';

export const GroupedSelectSearchController = <T extends FieldValues>({
  name,
  control,
  options,
}: GroupedSelectControllerProps<T>) => {
  const { t } = useTranslation('app');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectOpen, setSelectOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLLIElement | null>(null);
  const [currentItemType, setCurrentItemType] = useState<ItemInputTypes | null>(null);
  const searchTermLowercase = searchTerm.toLowerCase();

  const handleTooltipOpen = (event: MouseEvent<HTMLLIElement>, itemType: ItemInputTypes) => {
    setCurrentItemType(itemType);
    setAnchorEl(event.currentTarget);
  };

  const handleTooltipClose = () => {
    setCurrentItemType(null);
    setAnchorEl(null);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    setSearchTerm(event.target.value);
  };

  const handleSelectOpen = () => setSelectOpen(true);

  const handleSelectClose = async () => {
    await setSelectOpen(false);
    setSearchTerm('');
    handleTooltipClose();
  };

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <FormControl fullWidth>
            <InputLabel id="input-type-label">{t('itemType')}</InputLabel>
            <StyledSelect
              fullWidth
              MenuProps={{
                autoFocus: false,
                PaperProps: { sx: selectDropdownStyles },
              }}
              sx={{ pr: theme.spacing(1) }}
              onChange={onChange}
              value={value}
              labelId="input-type-label"
              label={t('inputType')}
              renderValue={() => (
                <StyledFlexTopCenter>
                  <StyledFlexTopCenter sx={{ mr: theme.spacing(1) }}>
                    {itemsTypeIcons[value]}
                  </StyledFlexTopCenter>
                  {t(value)}
                </StyledFlexTopCenter>
              )}
              open={selectOpen}
              onClose={handleSelectClose}
              onOpen={handleSelectOpen}
              IconComponent={() => <Svg id={selectOpen ? 'navigate-up' : 'navigate-down'} />}
              defaultValue=""
            >
              <StyledListSubheader>
                <form autoComplete="off">
                  <TextField
                    autoFocus
                    placeholder={t('searchItemType')}
                    fullWidth
                    onChange={handleSearchChange}
                    onKeyDown={handleSearchKeyDown}
                    InputProps={{
                      startAdornment: <Svg id="search" />,
                      endAdornment: (
                        <StyledClearedButton onClick={handleSelectClose}>
                          <Svg id="close" />
                        </StyledClearedButton>
                      ),
                    }}
                  />
                </form>
              </StyledListSubheader>
              {options?.map(({ groupName, groupOptions }) => [
                getGroupName(groupName, groupOptions, searchTermLowercase),
                ...groupOptions.map(({ value: groupValue, icon }) => {
                  const isHidden = getIsNotHaveSearchValue(groupValue, searchTermLowercase);

                  return (
                    <StyledMenuItem
                      onMouseEnter={
                        selectOpen
                          ? (event) => handleTooltipOpen(event, groupValue)
                          : falseReturnFunc
                      }
                      onMouseLeave={handleTooltipClose}
                      isHidden={isHidden}
                      key={groupValue}
                      value={groupValue}
                    >
                      <StyledFlexTopCenter>
                        <StyledFlexTopCenter sx={{ mr: theme.spacing(1.8) }}>
                          {icon}
                        </StyledFlexTopCenter>
                        {getGroupValueText(searchTerm, groupValue)}
                      </StyledFlexTopCenter>
                    </StyledMenuItem>
                  );
                }),
              ])}
              {getEmptyComponent(searchTerm)}
            </StyledSelect>
          </FormControl>
        )}
      />
      {currentItemType && <ItemTypeTooltip uiType={currentItemType} anchorEl={anchorEl} />}
    </>
  );
};
