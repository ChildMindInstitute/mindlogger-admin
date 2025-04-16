import {
  Box,
  BoxProps,
  FormControl,
  FormHelperText,
  InputLabel,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { ChangeEvent, MouseEvent, ReactNode, useState } from 'react';
import { Controller, FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ItemResponseTypeNoPerfTasks } from 'modules/Builder/types';
import { Chip, ChipShape, OptionalTooltipWrapper } from 'shared/components';
import { Svg } from 'shared/components/Svg';
import { ItemResponseType, itemsTypeIcons } from 'shared/consts';
import { useFeatureFlags } from 'shared/hooks';
import { StyledClearedButton, StyledFlexTopCenter, theme } from 'shared/styles';
import { falseReturnFunc, getIsMobileOnly, getIsWebOnly } from 'shared/utils';

import { getItemsTypeChip } from '../ItemConfiguration.utils';
import { selectDropdownStyles } from './GroupedSelectSearchController.const';
import { useItemTypeSelectSetup } from './GroupedSelectSearchController.hooks';
import {
  StyledListSubheader,
  StyledMenuItem,
  StyledSelect,
} from './GroupedSelectSearchController.styles';
import { GroupedSelectControllerProps } from './GroupedSelectSearchController.types';
import { handleSearchKeyDown } from './GroupedSelectSearchController.utils';
import { ItemTypeTooltip } from './ItemTypeTooltip';

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
  onBeforeChange,
  checkIfSelectChangePopupIsVisible,
}: GroupedSelectControllerProps<T>) => {
  const { t } = useTranslation('app');
  const { featureFlags } = useFeatureFlags();
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
          const handleOnSelectChange = (event: SelectChangeEvent<unknown>, _: ReactNode) => {
            const newValue = event.target.value as ItemResponseType;

            if (onBeforeChange && !onBeforeChange(newValue)) {
              return;
            }

            if (checkIfSelectChangePopupIsVisible) {
              checkIfSelectChangePopupIsVisible(() => {
                onChange(event);
                processItemType(event as ChangeEvent<HTMLInputElement>);
              });

              return;
            }

            onChange(event);
            processItemType(event as ChangeEvent<HTMLInputElement>);
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
                    chip={getItemsTypeChip({ value, featureFlags })}
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
                  ...groupOptions.map(({ value, icon, disabled, tooltip }) => {
                    const isHidden = getIsNotHaveSearchValue(value, searchTermLowercase);

                    return (
                      <StyledMenuItem
                        onMouseEnter={
                          selectOpen ? (event) => handleTooltipOpen(event, value) : falseReturnFunc
                        }
                        onMouseLeave={handleTooltipClose}
                        isHidden={isHidden}
                        key={value}
                        value={disabled ? undefined : value}
                        disabled={disabled}
                        data-testid={`${dataTestid}-option-${value}`}
                      >
                        <OptionalTooltipWrapper tooltipTitle={tooltip} placement="left">
                          <Box sx={{ position: 'relative', ml: -1.2, pl: 1.2 }}>
                            <SelectItemContent
                              icon={
                                <StyledFlexTopCenter sx={{ mr: 0.8 }}>{icon}</StyledFlexTopCenter>
                              }
                              label={getGroupValueText(searchTerm, value)}
                              value={value}
                              chip={getItemsTypeChip({ value, featureFlags })}
                            />
                          </Box>
                        </OptionalTooltipWrapper>
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
