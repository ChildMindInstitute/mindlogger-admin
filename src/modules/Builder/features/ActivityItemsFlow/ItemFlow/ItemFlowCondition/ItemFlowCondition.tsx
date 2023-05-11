import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import {
  StyledClearedButton,
  StyledFlexAllCenter,
  StyledTitleMedium,
  variables,
  theme,
} from 'shared/styles';
import { getEntityKey } from 'shared/utils';
import { SelectEvent } from 'shared/types';
import { ConditionType, ItemResponseType } from 'shared/consts';
import { useCurrentActivity } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.hooks';
import { ItemFormValues } from 'modules/Builder/pages';

import {
  StyledConditionContainer,
  StyledSelectController,
  StyledInputController,
} from './ItemFlowCondition.styles';
import { ItemFlowConditionProps } from './ItemFlowCondition.types';
import { getItemNameOptionsList, getTypeOptionsList, getPayload } from './ItemFlowCondition.utils';
import {
  CONDITION_TYPES_TO_HAVE_RANGE_VALUE,
  CONDITION_TYPES_TO_HAVE_SINGLE_VALUE,
  DEFAULT_PAYLOAD_MIN_VALUE,
  DEFAULT_PAYLOAD_MAX_VALUE,
} from './ItemFlowCondition.const';

export const ItemFlowCondition = ({ name, index }: ItemFlowConditionProps) => {
  const { t } = useTranslation('app');
  const { control, setValue, getValues, watch } = useFormContext();
  const { fieldName } = useCurrentActivity();

  const conditionName = `${name}.${index}`;
  const conditionItemName = `${conditionName}.itemName`;
  const conditionTypeName = `${conditionName}.type`;
  const conditionPayloadName = `${conditionName}.payload`;
  const conditionPayloadSelectionName = `${conditionPayloadName}.optionId`;
  const conditionPayloadValueName = `${conditionPayloadName}.value`;
  const conditionPayloadMinValueName = `${conditionPayloadName}.minValue`;
  const conditionPayloadMaxValueName = `${conditionPayloadName}.maxValue`;

  const items = watch(`${fieldName}.items`);
  const conditionItem = watch(conditionItemName);
  const conditionType = watch(conditionTypeName);
  const conditionPayload = watch(conditionPayloadName);
  const conditionItemResponseType = items?.find(
    (item: ItemFormValues) => getEntityKey(item) === conditionItem,
  )?.responseType;

  console.log('conditionPayload', conditionPayload);
  const handleChangeConditionItemName = (e: SelectEvent) => {
    const itemResponseType = items?.find(
      (item: ItemFormValues) => getEntityKey(item) === e.target.value,
    )?.responseType;

    if (conditionItemResponseType !== itemResponseType) {
      setValue(conditionTypeName, '');
      setValue(conditionPayloadName, {});
    }
  };

  const handleChangeConditionType = (e: SelectEvent) => {
    const payload = getPayload(e.target.value as ConditionType, conditionPayload);

    setValue(conditionPayloadName, payload);
  };

  const isSlider = conditionItemResponseType === ItemResponseType.Slider;
  const isSelection =
    conditionItemResponseType === ItemResponseType.SingleSelection ||
    conditionItemResponseType === ItemResponseType.MultipleSelection;
  const hasRangeValueInput =
    isSlider && CONDITION_TYPES_TO_HAVE_RANGE_VALUE.includes(conditionType);
  const isSingleNumberValueVisible = isSlider && !hasRangeValueInput;

  const commonInputSx = {
    minWidth: '10rem',
  };
  const numberInputSx = {
    width: '8rem',
  };

  return (
    <StyledConditionContainer>
      <StyledTitleMedium>{t('if')}</StyledTitleMedium>
      <StyledSelectController
        control={control}
        name={conditionItemName}
        options={getItemNameOptionsList(items)}
        placeholder={t('conditionItemNamePlaceholder')}
        sx={commonInputSx}
        SelectProps={{
          renderValue: (value: unknown) => {
            const itemName = items?.find(
              (item: ItemFormValues) => getEntityKey(item) === value,
            )?.name;

            return <span>{t('conditionItemNameSelected', { value: itemName })}</span>;
          },
        }}
        customChange={handleChangeConditionItemName}
      />
      <StyledSelectController
        control={control}
        name={`${conditionName}.type`}
        options={getTypeOptionsList(conditionItemResponseType)}
        placeholder={t('conditionTypePlaceholder')}
        sx={commonInputSx}
        disabled={!conditionItem}
        customChange={handleChangeConditionType}
      />
      {!isSlider && (
        <StyledSelectController
          control={control}
          name={conditionPayloadSelectionName}
          options={[]}
          sx={commonInputSx}
          placeholder={t('value')}
          disabled={!isSelection}
        />
      )}
      {isSingleNumberValueVisible && (
        <StyledInputController
          type="number"
          control={control}
          name={conditionPayloadValueName}
          disabled={!conditionType}
          sx={numberInputSx}
          minNumberValue={conditionType ? Number.MIN_SAFE_INTEGER : DEFAULT_PAYLOAD_MIN_VALUE}
        />
      )}
      {hasRangeValueInput && (
        <>
          <StyledInputController
            key={`min-value-${hasRangeValueInput}`}
            type="number"
            control={control}
            name={conditionPayloadMinValueName}
            sx={numberInputSx}
            minNumberValue={Number.MIN_SAFE_INTEGER}
          />
          <StyledInputController
            key={`max-value-${hasRangeValueInput}`}
            type="number"
            control={control}
            name={conditionPayloadMaxValueName}
            sx={numberInputSx}
            minNumberValue={Number.MIN_SAFE_INTEGER}
          />
        </>
      )}
      <StyledClearedButton sx={{ p: theme.spacing(1) }}>
        <Svg id="cross" />
      </StyledClearedButton>
    </StyledConditionContainer>
  );
};
