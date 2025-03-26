import { ChangeEvent, MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, FieldValues } from 'react-hook-form';
import { BoxProps, FormControl, FormHelperText, InputLabel, TextField } from '@mui/material';

import { Svg } from 'shared/components/Svg';
import { StyledClearedButton, StyledFlexTopCenter, theme } from 'shared/styles';
import { falseReturnFunc, getIsMobileOnly, getIsWebOnly } from 'shared/utils';
import { ItemResponseType, itemsTypeIcons } from 'shared/consts';
import { ItemResponseTypeNoPerfTasks } from 'modules/Builder/types';
import { Chip, ChipShape } from 'shared/components';

import { GroupedSelectControllerProps } from './GroupedSelectSearchController.types';
import {
  StyledListSubheader,
  StyledMenuItem,
  StyledSelect,
} from './GroupedSelectSearchController.styles';
import { ItemTypeTooltip } from './ItemTypeTooltip';
import { selectDropdownStyles } from './GroupedSelectSearchController.const';
import { handleSearchKeyDown } from './GroupedSelectSearchController.utils';
import { useItemTypeSelectSetup } from './GroupedSelectSearchController.hooks';

const dataTestid = 'builder-activity-items-item-configuration-response-type';

const SelectItemContent = ({
  icon,
  label,
  sx,
  value,
  chip,
  ...otherProps
}: {
  icon?: React.ReactNode;
  label: React.ReactNode;
  value: ItemResponseType;
  chip?: React.ReactNode;
} & BoxProps) => {
  const { t } = useTranslation('app');
  const isMobileOnly = getIsMobileOnly(value);
  const isWebOnly = getIsWebOnly(value);

  return (
    <StyledFlexTopCenter sx={{ ...sx, gap: 1, maxHeight: 24 }} {...otherProps}>
      {icon}
      {label}
      {chip}
      {(isMobileOnly || isWebOnly) && (
        <Chip
          data-testid={isMobileOnly ? 'mobile-only-label' : 'web-only-label'}
          shape={ChipShape.RectangularLarge}
          title={isMobileOnly ? t('mobileOnly') : t('webOnly')}
        />
      )}
    </StyledFlexTopCenter>
  );
};

export const GroupedSelectSearchController = <T extends FieldValues>({
  name,
  control,
  options,
  setValue,
  fieldName,
  checkIfSelectChangePopupIsVisible,
}: GroupedSelectControllerProps<T>) => {
  const { t } = useTranslation('app');
  const {
    getItemLanguageKey,
    getIsNotHaveSearchValue,
    getEmptyComponent,
    getGroupName,
    getGroupValueText,
  } = useItemTypeSelectSetup();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectOpen, setSelectOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLLIElement | null>(null);
  const [currentItemType, setCurrentItemType] = useState<ItemResponseTypeNoPerfTasks | null>(null);
  const searchTermLowercase = searchTerm.toLowerCase();

  const handleTooltipOpen = (
    event: MouseEvent<HTMLLIElement>,
    itemType: ItemResponseTypeNoPerfTasks,
  ) => {
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

  const processItemType = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value !== ItemResponseType.Drawing) return;

    setValue(`${fieldName}.responseValues.proportion.enabled`, true);
  };

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          const handleOnSelectChange = (...props: unknown[]) => {
            if (checkIfSelectChangePopupIsVisible) {
              checkIfSelectChangePopupIsVisible(() => {
                onChange(...props);
                processItemType(props[0] as ChangeEvent<HTMLInputElement>);
              });

              return;
            }

            onChange(...props);
            processItemType(props[0] as ChangeEvent<HTMLInputElement>);
          };

          return (
            <FormControl fullWidth error={!!error}>
              <InputLabel id="input-type-label">{t('itemType')}</InputLabel>
              <StyledSelect
                fullWidth
                MenuProps={{
                  autoFocus: false,
                  PaperProps: { sx: selectDropdownStyles, 'data-testid': 'popover-menu' },
                }}
                sx={{ pr: theme.spacing(1) }}
                onChange={handleOnSelectChange}
                value={value}
                labelId="input-type-label"
                label={t('itemType')}
                renderValue={() => (
                  <SelectItemContent
                    icon={itemsTypeIcons[value]}
                    label={t(getItemLanguageKey(value))}
                    value={value}
                  />
                )}
                open={selectOpen}
                onClose={handleSelectClose}
                onOpen={handleSelectOpen}
                IconComponent={() => (
                  <Svg
                    className="navigate-arrow"
                    id={selectOpen ? 'navigate-up' : 'navigate-down'}
                  />
                )}
                defaultValue=""
                data-testid={dataTestid}
              >
                <StyledListSubheader>
                  <form autoComplete="off">
                    <TextField
                      autoFocus
                      placeholder={t('searchItemType')}
                      fullWidth
                      value={searchTerm}
                      onChange={handleSearchChange}
                      onKeyDown={handleSearchKeyDown}
                      onClick={(event) => {
                        event.stopPropagation();
                      }}
                      InputProps={{
                        startAdornment: <Svg id="search" />,
                        endAdornment: searchTerm && (
                          <StyledClearedButton
                            onClick={() => setSearchTerm('')}
                            data-testid="clear-button"
                          >
                            <Svg id="close" />
                          </StyledClearedButton>
                        ),
                      }}
                      data-testid={`${dataTestid}-search`}
                    />
                  </form>
                </StyledListSubheader>

                {options?.map(({ groupName, groupOptions }) => [
                  getGroupName(groupName, groupOptions, searchTermLowercase),
                  ...groupOptions.map(({ value, icon, chip }) => {
                    const isHidden = getIsNotHaveSearchValue(value, searchTermLowercase);

                    return (
                      <StyledMenuItem
                        onMouseEnter={
                          selectOpen ? (event) => handleTooltipOpen(event, value) : falseReturnFunc
                        }
                        onMouseLeave={handleTooltipClose}
                        isHidden={isHidden}
                        key={value}
                        value={value}
                        data-testid={`${dataTestid}-option-${value}`}
                      >
                        <SelectItemContent
                          icon={<StyledFlexTopCenter sx={{ mr: 0.8 }}>{icon}</StyledFlexTopCenter>}
                          label={getGroupValueText(searchTerm, value)}
                          value={value}
                          chip={chip}
                        />
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
