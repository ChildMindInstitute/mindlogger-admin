import { useTranslation } from 'react-i18next';

import { StyledTitleMedium, StyledClearedButton, theme } from 'shared/styles';
import { Svg } from 'shared/components';
import { CONDITION_TYPES_TO_HAVE_RANGE_VALUE } from 'shared/consts';

import { StyledCondition, StyledSelectController, StyledInputController } from './Condition.styles';
import { ConditionProps } from './Condition.types';
import { ConditionItemType, DEFAULT_NUMBER_MIN_VALUE } from './Condition.const';
import { getStateOptions } from './Condition.utils';

export const Condition = ({
  control,
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
}: ConditionProps) => {
  const { t } = useTranslation('app');

  const selectedItem = itemOptions?.find(({ value }) => value === item);

  const isItemSlider = selectedItem?.type === ConditionItemType.Slider;
  const isItemSelect =
    selectedItem?.type === ConditionItemType.SingleSelection ||
    selectedItem?.type === ConditionItemType.MultiSelection;
  const isValueSelectShown = !selectedItem || isItemSelect;
  const isNumberValueShown = isItemSlider && !CONDITION_TYPES_TO_HAVE_RANGE_VALUE.includes(state);
  const isRangeValueShown = isItemSlider && !isNumberValueShown;

  return (
    <StyledCondition>
      <StyledTitleMedium>{t('if')}</StyledTitleMedium>
      <StyledSelectController
        control={control}
        name={itemName}
        options={itemOptions}
        placeholder={t('conditionItemNamePlaceholder')}
        SelectProps={{
          renderValue: (value: unknown) => {
            const item = itemOptions?.find((item) => item.value === value);
            const placeholder =
              item?.type === ConditionItemType.Score
                ? 'conditionScoreSelected'
                : 'conditionItemSelected';

            return <span>{t(placeholder, { value: item?.labelKey })}</span>;
          },
        }}
        customChange={onItemChange}
        isLabelNeedTranslation={false}
      />
      <StyledSelectController
        control={control}
        name={stateName}
        options={getStateOptions(selectedItem?.type)}
        placeholder={t('conditionTypePlaceholder')}
        customChange={onStateChange}
        isLabelNeedTranslation={false}
      />
      {isValueSelectShown && (
        <StyledSelectController
          control={control}
          name={optionValueName}
          options={valueOptions}
          placeholder={t('value')}
          isLabelNeedTranslation={false}
        />
      )}
      {isNumberValueShown && (
        <StyledInputController
          type="number"
          control={control}
          name={numberValueName}
          minNumberValue={state ? Number.MIN_SAFE_INTEGER : DEFAULT_NUMBER_MIN_VALUE}
        />
      )}
      {isRangeValueShown && (
        <>
          <StyledInputController
            key={`min-value-${isRangeValueShown}`}
            type="number"
            control={control}
            name={minValueName}
            minNumberValue={Number.MIN_SAFE_INTEGER}
          />
          <StyledInputController
            key={`max-value-${isRangeValueShown}`}
            type="number"
            control={control}
            name={maxValueName}
            minNumberValue={Number.MIN_SAFE_INTEGER}
          />
        </>
      )}
      {isRemoveVisible && (
        <StyledClearedButton sx={{ p: theme.spacing(1) }} onClick={onRemove}>
          <Svg id="cross" />
        </StyledClearedButton>
      )}
    </StyledCondition>
  );
};
