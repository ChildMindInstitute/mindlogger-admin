import { ChangeEvent, KeyboardEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, FieldValues } from 'react-hook-form';
import { TextField, FormControl, InputLabel } from '@mui/material';

import theme from 'styles/theme';
import { Svg } from 'components';
import { StyledClearedButton, StyledFlexTopCenter } from 'styles/styledComponents';

import { itemsTypeIcons } from '../ItemConfiguration.const';
import { GroupedSelectControllerProps } from './GroupedSelectSearchController.types';
import {
  StyledGroupName,
  StyledMenuItem,
  StyledSelect,
  StyledListSubheader,
} from './GroupedSelectSearchController.styles';

export const GroupedSelectSearchController = <T extends FieldValues>({
  name,
  control,
  options,
}: GroupedSelectControllerProps<T>) => {
  const { t } = useTranslation('app');
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    setSearchTerm(event.target.value);
  };

  const handleSearchKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') {
      event.stopPropagation();
    }
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSearchTerm('');
  };

  const handleOpen = () => setOpen(true);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <FormControl fullWidth>
          <InputLabel id="input-type-label">{t('inputType')}</InputLabel>
          <StyledSelect
            autoComplete="new-select"
            fullWidth
            MenuProps={{ autoFocus: false }}
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
            open={open}
            onClose={handleClose}
            onOpen={handleOpen}
            IconComponent={() => <Svg id={open ? 'navigate-up' : 'navigate-down'} />}
            defaultValue=""
          >
            <StyledListSubheader>
              <form autoComplete="off">
                <TextField
                  autoFocus
                  placeholder={t('searchInputType')}
                  fullWidth
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchKeyDown}
                  InputProps={{
                    startAdornment: <Svg id="search" />,
                    endAdornment: (
                      <StyledClearedButton onClick={() => setSearchTerm('')}>
                        <Svg id="close" />
                      </StyledClearedButton>
                    ),
                  }}
                />
              </form>
            </StyledListSubheader>
            {options?.map(({ groupName, groupOptions }) => [
              searchTerm ? [] : <StyledGroupName key={groupName}>{t(groupName)}</StyledGroupName>,
              ...groupOptions
                .filter(
                  ({ value: groupValue }) =>
                    t(groupValue).toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1,
                )
                .map(({ value: groupValue, icon }) => (
                  <StyledMenuItem key={groupValue} value={groupValue}>
                    <StyledFlexTopCenter>
                      <StyledFlexTopCenter sx={{ mr: theme.spacing(1.8) }}>
                        {icon}
                      </StyledFlexTopCenter>
                      {t(groupValue)}
                    </StyledFlexTopCenter>
                  </StyledMenuItem>
                )),
            ])}
          </StyledSelect>
        </FormControl>
      )}
    />
  );
};
