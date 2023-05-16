import { useFormContext } from 'react-hook-form';

import { getEntityKey } from 'shared/utils';
import { SelectEvent } from 'shared/types';
import { ConditionType, ItemResponseType } from 'shared/consts';
import { useCurrentActivity } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.hooks';
import { ItemFormValues } from 'modules/Builder/pages';
import { Condition } from 'modules/Builder/components';

import { ConditionRowProps } from './ConditionRow.types';
import { getItemOptions, getPayload, getValueOptionsList } from './ConditionRow.utils';

export const ConditionRow = ({ name, index, onRemove }: ConditionRowProps) => {
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

  return (
    <Condition
      control={control}
      itemName={conditionItemName}
      stateName={conditionTypeName}
      optionValueName={conditionPayloadSelectionName}
      numberValueName={conditionPayloadValueName}
      minValueName={conditionPayloadMinValueName}
      maxValueName={conditionPayloadMaxValueName}
      itemOptions={getItemOptions(items)}
      valueOptions={getValueOptionsList(selectedItem)}
      item={conditionItem}
      state={conditionType}
      isRemoveVisible={conditions?.length > 1}
      onItemChange={handleChangeConditionItemName}
      onStateChange={handleChangeConditionType}
      onRemove={onRemove}
    />
  );
};
