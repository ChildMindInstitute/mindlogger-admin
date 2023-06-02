import { useFormContext } from 'react-hook-form';

import { getEntityKey } from 'shared/utils';
import { SelectEvent } from 'shared/types';
import { ConditionType } from 'shared/consts';
import { useCurrentActivity } from 'modules/Builder/hooks';
import { ItemFormValues } from 'modules/Builder/types';
import { Condition } from 'modules/Builder/components';

import { ConditionRowProps } from './ScoreConditionRow.types';
import { getItemOptions, getPayload, getValueOptionsList } from './ScoreConditionRow.utils';
import { ScoreConditionRowType } from '../ConditionContent.types';

export const ScoreConditionRow = ({ name, index, onRemove, type }: ConditionRowProps) => {
  const { control, setValue, watch } = useFormContext();
  const { fieldName } = useCurrentActivity();

  const conditionsName = `${name}.condition`;
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
  const scores = watch(`${fieldName}.scores`);
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

  const scoresConditions = scores?.map((score: any) => score.conditionalLogic);

  const itemOptions =
    type === ScoreConditionRowType.Section
      ? [...getItemOptions(items), ...[scores || []], ...scoresConditions]
      : scoresConditions;

  return (
    <Condition
      control={control}
      itemName={conditionItemName}
      stateName={conditionTypeName}
      optionValueName={conditionPayloadSelectionName}
      numberValueName={conditionPayloadValueName}
      minValueName={conditionPayloadMinValueName}
      maxValueName={conditionPayloadMaxValueName}
      itemOptions={itemOptions}
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
