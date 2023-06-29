import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { getEntityKey } from 'shared/utils';
import { SelectEvent } from 'shared/types';
import { ConditionType } from 'shared/consts';
import { useCurrentActivity } from 'modules/Builder/hooks';
import { ConditionRowType, ItemFormValues } from 'modules/Builder/types';

import { ConditionRowProps } from './ConditionRow.types';
import {
  getItemOptions,
  getPayload,
  getScoreConditionalsOptions,
  getScoreIdOption,
  getScoreOptions,
  getValueOptionsList,
} from './ConditionRow.utils';
import { Condition } from './Condition';

export const ConditionRow = ({
  name,
  index,
  onRemove,
  type = ConditionRowType.Item,
  scoreId,
  scoreName,
}: ConditionRowProps) => {
  const { control, setValue, watch } = useFormContext();
  const { fieldName } = useCurrentActivity();

  const conditionsName = `${name}.conditions`;
  const conditionName = `${conditionsName}.${index}`;
  const conditionItemName = `${conditionName}.itemName`;
  const conditionTypeName = `${conditionName}.type`;
  const conditionPayloadName = `${conditionName}.payload`;
  const conditionPayloadSelectionName = `${conditionPayloadName}.optionValue`;
  const conditionPayloadValueName = `${conditionPayloadName}.value`;
  const conditionPayloadMinValueName = `${conditionPayloadName}.minValue`;
  const conditionPayloadMaxValueName = `${conditionPayloadName}.maxValue`;

  const conditions = watch(conditionsName);
  const items = watch(`${fieldName}.items`);
  const scores = watch(`${fieldName}.scoresAndReports.scores`);
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

  const options = {
    [ConditionRowType.Item]: getItemOptions(items, type),
    [ConditionRowType.Section]: [
      ...getItemOptions(items, type),
      ...((scores?.length && getScoreOptions(scores)) || []),
      ...((scores?.length && getScoreConditionalsOptions(scores)) || []),
    ],
    [ConditionRowType.Score]: [getScoreIdOption(scoreId!, scoreName!)],
  };

  useEffect(() => {
    if (type === ConditionRowType.Score) {
      setValue(conditionItemName, scoreName);
    }
  }, [type, scoreName]);

  return (
    <Condition
      control={control}
      itemName={conditionItemName}
      stateName={conditionTypeName}
      optionValueName={conditionPayloadSelectionName}
      numberValueName={conditionPayloadValueName}
      minValueName={conditionPayloadMinValueName}
      maxValueName={conditionPayloadMaxValueName}
      itemOptions={options[type]}
      valueOptions={getValueOptionsList(selectedItem)}
      item={conditionItem}
      state={conditionType}
      isRemoveVisible={conditions?.length > 1}
      onItemChange={handleChangeConditionItemName}
      onStateChange={handleChangeConditionType}
      onRemove={onRemove}
      type={type}
    />
  );
};
