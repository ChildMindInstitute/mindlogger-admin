import { useTranslation } from 'react-i18next';

import { StyledTitleMedium, StyledClearedButton, theme } from 'shared/styles';
import { Svg } from 'shared/components/Svg';
import { useCustomFormContext } from 'modules/Builder/hooks';
import { ConditionRowType } from 'modules/Builder/types';

import { StyledCondition, StyledSelectController } from './Condition.styles';
import { ConditionProps } from './Condition.types';
import { ConditionItemType } from './Condition.const';
import { getScoreConditionOptions, getStateOptions } from './Condition.utils';
import { SwitchCondition } from './SwitchCondition';

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
