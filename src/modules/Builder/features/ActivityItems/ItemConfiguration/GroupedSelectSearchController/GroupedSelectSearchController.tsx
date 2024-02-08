import { ChangeEvent, MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, FieldValues } from 'react-hook-form';
import { FormControl, FormHelperText, InputLabel, TextField } from '@mui/material';

import { Svg } from 'shared/components/Svg';
import { StyledBodyMedium, StyledClearedButton, StyledFlexTopCenter, theme } from 'shared/styles';
import { falseReturnFunc } from 'shared/utils';
import { itemsTypeIcons } from 'shared/consts';
import { ItemResponseTypeNoPerfTasks } from 'modules/Builder/types';

import { GroupedSelectControllerProps } from './GroupedSelectSearchController.types';
import {
  StyledListSubheader,
  StyledMenuItem,
  StyledMobileOnly,
  StyledSelect,
} from './GroupedSelectSearchController.styles';
import { ItemTypeTooltip } from './ItemTypeTooltip';
import { selectDropdownStyles } from './GroupedSelectSearchController.const';
import {
  getEmptyComponent,
  getGroupName,
  getGroupValueText,
  getIsNotHaveSearchValue,
  getIsOnlyMobileValue,
  handleSearchKeyDown,
} from './GroupedSelectSearchController.utils';

export const GroupedSelectSearchController = <T extends FieldValues>({
  name,
  control,
  options,
  checkIfSelectChangePopupIsVisible,
}: GroupedSelectControllerProps<T>) => {
  const { t } = useTranslation('app');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectOpen, setSelectOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLLIElement | null>(null);
  const [currentItemType, setCurrentItemType] = useState<ItemResponseTypeNoPerfTasks | null>(null);
  const searchTermLowercase = searchTerm.toLowerCase();

  const handleTooltipOpen = (event: MouseEvent<HTMLLIElement>, itemType: ItemResponseTypeNoPerfTasks) => {
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

  const mobileOnly = (
    <StyledMobileOnly>
      <StyledBodyMedium>{t('mobileOnly')}</StyledBodyMedium>
    </StyledMobileOnly>
  );

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          const handleOnSelectChange = (...props: unknown[]) => {
            if (checkIfSelectChangePopupIsVisible) {
              checkIfSelectChangePopupIsVisible(() => onChange(...props));

              return;
            }
            onChange(...props);
          };

          return (
            <FormControl fullWidth error={!!error}>
              <InputLabel id="input-type-label">{t('itemType')}</InputLabel>
              <StyledSelect
                fullWidth
                MenuProps={{
                  autoFocus: false,
                  PaperProps: { sx: selectDropdownStyles },
                }}
                sx={{ pr: theme.spacing(1) }}
                onChange={handleOnSelectChange}
                value={value}
                labelId="input-type-label"
                label={t('itemType')}
                renderValue={() => (
                  <StyledFlexTopCenter sx={{ maxHeight: '2.3rem' }}>
                    <StyledFlexTopCenter sx={{ overflow: 'hidden' }}>
                      <StyledFlexTopCenter sx={{ mr: theme.spacing(1) }}>{itemsTypeIcons[value]}</StyledFlexTopCenter>
                      {t(value)}
                      {getIsOnlyMobileValue(value) && mobileOnly}
                    </StyledFlexTopCenter>
                  </StyledFlexTopCenter>
                )}
                open={selectOpen}
                onClose={handleSelectClose}
                onOpen={handleSelectOpen}
                IconComponent={() => (
                  <Svg className="navigate-arrow" id={selectOpen ? 'navigate-up' : 'navigate-down'} />
                )}
                defaultValue=""
                data-testid="builder-activity-items-item-configuration-response-type">
                <StyledListSubheader>
                  <form autoComplete="off">
                    <TextField
                      autoFocus
                      placeholder={t('searchItemType')}
                      fullWidth
                      value={searchTerm}
                      onChange={handleSearchChange}
                      onKeyDown={handleSearchKeyDown}
                      onClick={event => {
                        event.stopPropagation();
                      }}
                      InputProps={{
                        startAdornment: <Svg id="search" />,
                        endAdornment: searchTerm && (
                          <StyledClearedButton onClick={() => setSearchTerm('')}>
                            <Svg id="close" />
                          </StyledClearedButton>
                        ),
                      }}
                      data-testid="builder-activity-items-item-configuration-response-type-search"
                    />
                  </form>
                </StyledListSubheader>
                {options?.map(({ groupName, groupOptions }) => [
                  getGroupName(groupName, groupOptions, searchTermLowercase),
                  ...groupOptions.map(({ value: groupValue, icon, isMobileOnly }) => {
                    const isHidden = getIsNotHaveSearchValue(groupValue, searchTermLowercase);

                    return (
                      <StyledMenuItem
                        onMouseEnter={selectOpen ? event => handleTooltipOpen(event, groupValue) : falseReturnFunc}
                        onMouseLeave={handleTooltipClose}
                        isHidden={isHidden}
                        key={groupValue}
                        value={groupValue}
                        data-testid={`builder-activity-items-item-configuration-response-type-option-${groupValue}`}>
                        <StyledFlexTopCenter>
                          <StyledFlexTopCenter sx={{ mr: theme.spacing(1.8) }}>{icon}</StyledFlexTopCenter>
                          <StyledFlexTopCenter>
                            {getGroupValueText(searchTerm, groupValue)}
                            {isMobileOnly && mobileOnly}
                          </StyledFlexTopCenter>
                        </StyledFlexTopCenter>
                      </StyledMenuItem>
                    );
                  }),
                ])}
                {getEmptyComponent(searchTerm)}
              </StyledSelect>
              {error?.message && <FormHelperText>{error.message}</FormHelperText>}
            </FormControl>
          );
        }}
      />
      {currentItemType && <ItemTypeTooltip uiType={currentItemType} anchorEl={anchorEl} />}
    </>
  );
};
