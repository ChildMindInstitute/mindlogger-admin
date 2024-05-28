import { useTranslation } from 'react-i18next';
import { useWatch } from 'react-hook-form';
import { addDays } from 'date-fns';

import {
  StyledTitleMedium,
  StyledClearedButton,
  theme,
  StyledBodyLarge,
  StyledFlexTopCenter,
} from 'shared/styles';
import { Svg } from 'shared/components/Svg';
import { CONDITION_TYPES_TO_HAVE_RANGE_VALUE } from 'shared/consts';
import { useCustomFormContext } from 'modules/Builder/hooks';
import { ConditionRowType } from 'modules/Builder/types';
import { DatePicker } from 'shared/components';

import { StyledCondition, StyledInputController, StyledSelectController } from './Condition.styles';
import { ConditionProps, SwitchConditionProps } from './Condition.types';
import { ConditionItemType } from './Condition.const';
import {
  getConditionMinMaxRangeValues,
  getConditionMinMaxValues,
  getScoreConditionOptions,
  getStateOptions,
} from './Condition.utils';

export const SwitchCondition = ({
  selectedItem,
  itemType,
  numberValueName,
  minValueName,
  maxValueName,
  state,
  dataTestid,
}: SwitchConditionProps) => {
  const { t } = useTranslation('app');
  const { control, setValue } = useCustomFormContext();
  const [minValue, maxValue] = useWatch({ name: [minValueName, maxValueName] });

  if (!itemType) return null;

  switch (itemType) {
    case ConditionItemType.Score:
    case ConditionItemType.Slider: {
      const isNumberValueShown = !CONDITION_TYPES_TO_HAVE_RANGE_VALUE.includes(state);
      const isRangeValueShown = !isNumberValueShown;

      const { minNumber, maxNumber } = getConditionMinMaxValues({
        item: selectedItem,
        state,
      });

      const { leftRange, rightRange } = getConditionMinMaxRangeValues({
        item: selectedItem,
        minValue,
        maxValue,
      });

      return (
        <>
          {isNumberValueShown && (
            <StyledInputController
              type="number"
              control={control}
              name={numberValueName}
              minNumberValue={minNumber}
              maxNumberValue={maxNumber}
              data-testid={`${dataTestid}-slider-value`}
            />
          )}
          {isRangeValueShown && (
            <>
              <StyledInputController
                key={`min-value-${isRangeValueShown}`}
                type="number"
                control={control}
                name={minValueName}
                minNumberValue={leftRange.minNumber}
                maxNumberValue={leftRange.maxNumber}
                data-testid={`${dataTestid}-min-value`}
              />
              <StyledInputController
                key={`max-value-${isRangeValueShown}`}
                type="number"
                control={control}
                name={maxValueName}
                minNumberValue={rightRange.minNumber}
                maxNumberValue={rightRange.maxNumber}
                data-testid={`${dataTestid}-max-value`}
              />
            </>
          )}
        </>
      );
    }
    case ConditionItemType.Date: {
      const isDateValueShown = !CONDITION_TYPES_TO_HAVE_RANGE_VALUE.includes(state);
      const isRangeDateShown = CONDITION_TYPES_TO_HAVE_RANGE_VALUE.includes(state);

      const commonDateInputProps = {
        control,
        placeholder: t('datePlaceholder'),
        hideLabel: true,
        inputWrapperSx: {
          minWidth: '18rem',
          width: '18rem',
        },
        inputSx: {
          height: '4rem',
        },
      };

      const onCloseStartDateCallback = () => {
        if (!minValue || !maxValue) return;
        if (maxValue < minValue) {
          setValue(maxValueName, addDays(minValue, 1));
        }
      };

      return (
        <>
          {isDateValueShown && (
            <StyledFlexTopCenter>
              <DatePicker
                name={numberValueName}
                onCloseCallback={onCloseStartDateCallback}
                data-testid={`${dataTestid}-date-value`}
                skipMinDate
                {...commonDateInputProps}
              />
            </StyledFlexTopCenter>
          )}
          {isRangeDateShown && (
            <StyledFlexTopCenter>
              <DatePicker
                name={minValueName}
                key={`min-date-value-${isRangeDateShown}`}
                onCloseCallback={onCloseStartDateCallback}
                data-testid={`${dataTestid}-start-date-value`}
                skipMinDate
                {...commonDateInputProps}
              />
              <StyledBodyLarge sx={{ m: theme.spacing(0, 0.4) }}>{t('and')}</StyledBodyLarge>
              <DatePicker
                name={maxValueName}
                key={`max-date-value-${isRangeDateShown}`}
                minDate={minValue as Date}
                data-testid={`${dataTestid}-end-date-value`}
                {...commonDateInputProps}
              />
            </StyledFlexTopCenter>
          )}
        </>
      );
    }
    default:
      return null;
  }
};

export const Condition = ({
  itemName,
  stateName,
  optionValueName,
  numberValueName,
  minValueName,
  maxValueName,
  itemOptions,
  valueOptions,
  item,
  state,
  onItemChange,
  onStateChange,
  isRemoveVisible,
  onRemove,
  type,
  'data-testid': dataTestid,
}: ConditionProps) => {
  const { t } = useTranslation('app');
  const { control } = useCustomFormContext();

  const selectedItem = itemOptions?.find(({ value }) => value === item);

  const isItemScoreCondition = selectedItem?.type === ConditionItemType.ScoreCondition;
  const isRowTypeItem = type === ConditionRowType.Item;
  const isRowTypeScore = type === ConditionRowType.Score;
  const isItemSelect =
    selectedItem?.type === ConditionItemType.SingleSelection ||
    selectedItem?.type === ConditionItemType.MultiSelection ||
    isItemScoreCondition;
  const isValueSelectShown = !selectedItem || isItemSelect;

  const isValueSelectDisabled = !isItemScoreCondition && !valueOptions?.length;
  const isStateSelectDisabled = !selectedItem?.type;

  const switchConditionProps = {
    itemType: selectedItem?.type,
    selectedItem,
    numberValueName,
    minValueName,
    maxValueName,
    state,
    dataTestid,
  };

  return (
    <StyledCondition data-testid={dataTestid}>
      <StyledTitleMedium>{t('if')}</StyledTitleMedium>
      <StyledSelectController
        control={control}
        name={itemName}
        options={itemOptions}
        placeholder={t(isRowTypeItem ? 'conditionItemNamePlaceholder' : 'select')}
        SelectProps={{
          renderValue: (value: unknown) => {
            const item = itemOptions?.find((item) => item.value === value);
            const placeholder = isRowTypeItem
              ? t('conditionItemSelected', { value: item?.labelKey })
              : item?.labelKey;

            return <span>{placeholder}</span>;
          },
        }}
        customChange={onItemChange}
        disabled={isRowTypeScore}
        shouldSkipIcon={isRowTypeScore}
        isLabelNeedTranslation={false}
        data-testid={`${dataTestid}-name`}
      />
      {!isRowTypeItem && <StyledTitleMedium>{t('is')}</StyledTitleMedium>}
      <StyledSelectController
        control={control}
        name={stateName}
        options={getStateOptions(selectedItem?.type)}
        placeholder={
          isStateSelectDisabled ? t('conditionDisabledPlaceholder') : t('conditionTypePlaceholder')
        }
        customChange={onStateChange}
        isLabelNeedTranslation={false}
        data-testid={`${dataTestid}-type`}
        disabled={isStateSelectDisabled}
      />
      {isValueSelectShown && (
        <StyledSelectController
          control={control}
          name={isItemScoreCondition ? numberValueName : optionValueName}
          options={isItemScoreCondition ? getScoreConditionOptions() : valueOptions}
          placeholder={isValueSelectDisabled ? t('conditionDisabledPlaceholder') : t('value')}
          isLabelNeedTranslation={false}
          data-testid={`${dataTestid}-selection-value`}
          disabled={isValueSelectDisabled}
        />
      )}
      <SwitchCondition {...switchConditionProps} />
      {isRemoveVisible && (
        <StyledClearedButton
          sx={{ p: theme.spacing(1) }}
          onClick={onRemove}
          data-testid={`${dataTestid}-remove`}
        >
          <Svg id="cross" />
        </StyledClearedButton>
      )}
    </StyledCondition>
  );
};
