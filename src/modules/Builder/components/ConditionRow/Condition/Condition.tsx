import { useTranslation } from 'react-i18next';

import { StyledTitleMedium, StyledClearedButton, theme } from 'shared/styles';
import { Svg } from 'shared/components/Svg';
import { useCustomFormContext } from 'modules/Builder/hooks';
import { ConditionRowType } from 'modules/Builder/types';

import { StyledCondition, StyledSelectController } from './Condition.styles';
import { ConditionProps } from './Condition.types';
import { getStateOptions } from './Condition.utils';
import { SwitchCondition } from './SwitchCondition';

export const Condition = ({
  itemName,
  stateName,
  payloadName,
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
  const isRowTypeItem = type === ConditionRowType.Item;
  const isRowTypeScore = type === ConditionRowType.Score;
  const isStateSelectDisabled = !selectedItem?.type;

  const switchConditionProps = {
    itemType: selectedItem?.type,
    selectedItem,
    payloadName,
    state,
    dataTestid,
    valueOptions,
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
      <SwitchCondition {...switchConditionProps}>
        <StyledSelectController
          control={control}
          name={stateName}
          options={getStateOptions(selectedItem?.type)}
          placeholder={
            isStateSelectDisabled
              ? t('conditionDisabledPlaceholder')
              : t('conditionTypePlaceholder')
          }
          customChange={onStateChange}
          isLabelNeedTranslation={false}
          data-testid={`${dataTestid}-type`}
          disabled={isStateSelectDisabled}
        />
      </SwitchCondition>
      {isStateSelectDisabled && (
        <>
          <StyledSelectController
            control={control}
            name={''}
            options={[]}
            placeholder={t('conditionDisabledPlaceholder')}
            isLabelNeedTranslation={false}
            data-testid={`${dataTestid}-type`}
            disabled
          />
          <StyledSelectController
            control={control}
            name={''}
            options={[]}
            placeholder={t('conditionDisabledPlaceholder')}
            isLabelNeedTranslation={false}
            data-testid={`${dataTestid}-selection-value`}
            disabled
          />
        </>
      )}
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
