import get from 'lodash.get';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { getEntityKey } from 'shared/utils';
import { SelectEvent } from 'shared/types';
import { ConditionType, ScoreReportType } from 'shared/consts';
import { ScoreOrSection, ScoreReport } from 'shared/state';
import { useCurrentActivity } from 'modules/Builder/hooks';
import { ConditionRowType, ItemFormValues } from 'modules/Builder/types';

import { StyledErrorText, theme } from 'shared/styles';
import { ConditionRowProps } from './ConditionRow.types';
import {
  getItemOptions,
  getPayload,
  getScoreConditionalsOptions,
  getScoreIdOption,
  getScoreOptions,
  getValueOptionsList,
} from './ConditionRow.utils';
import { Condition, ConditionItem } from './Condition';
import { VALIDATED_ITEMS_COUNT } from './ConditionRow.const';

export const ConditionRow = ({
  name,
  index,
  onRemove,
  type = ConditionRowType.Item,
  scoreKey,
  autoTrigger,
  showError = true,
  'data-testid': dataTestid,
}: ConditionRowProps) => {
  const { t } = useTranslation('app');
  const {
    control,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useFormContext();
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
  const reports = watch(`${fieldName}.scoresAndReports.reports`);
  const scores = reports?.filter((report: ScoreOrSection) => report.type === ScoreReportType.Score);
  const conditionItem = watch(conditionItemName);
  const conditionType = watch(conditionTypeName);
  const conditionPayload = watch(conditionPayloadName);
  const conditionItemResponseType = items?.find(
    (item: ItemFormValues) => getEntityKey(item) === conditionItem,
  )?.responseType;

  const selectedItem = items?.find((item: ItemFormValues) => getEntityKey(item) === conditionItem);
  const selectedScore =
    scores?.find((score: ScoreReport) => getEntityKey(score, false) === scoreKey) ?? {};
  const options = {
    [ConditionRowType.Item]: getItemOptions(items, type),
    [ConditionRowType.Section]: [
      ...getItemOptions(items, type),
      ...((scores?.length && getScoreOptions(scores)) || []),
      ...((scores?.length && getScoreConditionalsOptions(scores)) || []),
    ],
    [ConditionRowType.Score]: [getScoreIdOption(selectedScore)],
  } as Record<ConditionRowType, ConditionItem[]>;

  const handleChangeConditionItemName = (event: SelectEvent) => {
    const itemResponseType = items?.find(
      (item: ItemFormValues) => getEntityKey(item) === event.target.value,
    )?.responseType;

    if (conditionItemResponseType !== itemResponseType) {
      setValue(conditionTypeName, '');
      setValue(conditionPayloadName, {});
    }

    if (autoTrigger) trigger(`${name}.itemKey`);
  };

  const handleChangeConditionType = (e: SelectEvent) => {
    const payload = getPayload(e.target.value as ConditionType, conditionPayload, selectedItem);

    setValue(conditionPayloadName, payload);
  };

  const error = get(errors, `${conditionsName}[${index}]`);
  const errorMessage =
    showError &&
    error &&
    t(
      Object.keys(error).length === VALIDATED_ITEMS_COUNT
        ? 'setUpAtLeastOneCondition'
        : 'setUpCorrectCondition',
    );

  return (
    <>
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
        data-testid={dataTestid}
      />
      {errorMessage && (
        <StyledErrorText sx={{ mt: theme.spacing(0.6) }}>{errorMessage}</StyledErrorText>
      )}
    </>
  );
};
