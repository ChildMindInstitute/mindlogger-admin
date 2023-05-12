import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import { StyledClearedButton, StyledTitleMedium, theme } from 'shared/styles';
import { getEntityKey } from 'shared/utils';
import { SelectEvent } from 'shared/types';
import { ConditionType, ItemResponseType } from 'shared/consts';
import { useCurrentActivity } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.hooks';
import { ItemFormValues } from 'modules/Builder/pages';

import {
  StyledConditionRow,
  StyledSelectController,
  StyledInputController,
} from './ConditionRow.styles';
import { ConditionRowProps } from './ConditionRow.types';
import {
  getItemNameOptionsList,
  getTypeOptionsList,
  getPayload,
  getValueOptionsList,
} from './ConditionRow.utils';
import {
  CONDITION_TYPES_TO_HAVE_RANGE_VALUE,
  DEFAULT_PAYLOAD_MIN_VALUE,
} from './ConditionRow.const';

export const ConditionRow = ({ name, index, onRemove }: ConditionRowProps) => {
  const { t } = useTranslation('app');
  const { control, setValue, watch } = useFormContext();
  const { fieldName } = useCurrentActivity();

  const conditionsName = `${name}.conditions`;
  const conditionName = `${conditionsName}.${index}`;
  const conditionItemName = `${conditionName}.itemName`;
  const conditionTypeName = `${conditionName}.type`;
  const conditionPayloadName = `${conditionName}.payload`;
  const conditionPayloadSelectionName = `${conditionPayloadName}.optionId`;
  const conditionPayloadValueName = `${conditionPayloadName}.value`;
  const conditionPayloadMinValueName = `${conditionPayloadName}.minValue`;
  const conditionPayloadMaxValueName = `${conditionPayloadName}.maxValue`;

  const conditions = watch(conditionsName);
  const items = watch(`${fieldName}.items`);
  const conditionItem = watch(conditionItemName);
  const conditionType = watch(conditionTypeName);
  const conditionPayload = watch(conditionPayloadName);
  const conditionItemResponseType = items?.find(
    (item: ItemFormValues) => getEntityKey(item) === conditionItem,
  )?.responseType;

  const selectedItem = items?.find((item: ItemFormValues) => getEntityKey(item) === conditionItem);

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
  const hasRangeValueInput =
    isSlider && CONDITION_TYPES_TO_HAVE_RANGE_VALUE.includes(conditionType);
  const isSingleNumberValueVisible = isSlider && !hasRangeValueInput;

  return (
    <StyledConditionRow>
      <StyledTitleMedium>{t('if')}</StyledTitleMedium>
      <StyledSelectController
        control={control}
        name={conditionItemName}
        options={getItemNameOptionsList(items)}
        placeholder={t('conditionItemNamePlaceholder')}
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
        customChange={handleChangeConditionType}
      />
      {!isSlider && (
        <StyledSelectController
          control={control}
          name={conditionPayloadSelectionName}
          options={getValueOptionsList(selectedItem)}
          placeholder={t('value')}
        />
      )}
      {isSingleNumberValueVisible && (
        <StyledInputController
          type="number"
          control={control}
          name={conditionPayloadValueName}
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
            minNumberValue={Number.MIN_SAFE_INTEGER}
          />
          <StyledInputController
            key={`max-value-${hasRangeValueInput}`}
            type="number"
            control={control}
            name={conditionPayloadMaxValueName}
            minNumberValue={Number.MIN_SAFE_INTEGER}
          />
        </>
      )}
      {conditions?.length > 1 && (
        <StyledClearedButton sx={{ p: theme.spacing(1) }} onClick={onRemove}>
          <Svg id="cross" />
        </StyledClearedButton>
      )}
    </StyledConditionRow>
  );
};
