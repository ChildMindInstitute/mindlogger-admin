import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useWatch } from 'react-hook-form';
import get from 'lodash.get';

import { getEntityKey, getObjectFromList } from 'shared/utils';
import { SelectEvent } from 'shared/types';
import { ConditionType, ScoreReportType } from 'shared/consts';
import { ScoreOrSection, ScoreReport } from 'shared/state';
import { ConditionRowType, ItemFormValues } from 'modules/Builder/types';
import { useCustomFormContext } from 'modules/Builder/hooks';
import { StyledErrorText, theme } from 'shared/styles';
import { CONDITION_TYPES_TO_HAVE_OPTION_ID } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.const';
import { useFeatureFlags } from 'shared/hooks';

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
  activityName,
  index,
  onRemove,
  onChangeConditionType,
  type = ConditionRowType.Item,
  scoreKey,
  autoTrigger,
  showError = true,
  'data-testid': dataTestid,
  isItemFlow = false,
}: ConditionRowProps) => {
  const { t } = useTranslation('app');
  const { enableItemFlowItemsG2, enableItemFlowItemsG3 } = useFeatureFlags().featureFlags;
  const {
    setValue,
    trigger,
    formState: { errors },
    clearErrors,
  } = useCustomFormContext();

  const itemsName = `${activityName}.items`;
  const reportsName = `${activityName}.scoresAndReports.reports`;
  const conditionsName = `${name}.conditions`;
  const conditionName = `${conditionsName}.${index}`;
  const conditionItemName = `${conditionName}.itemName`;
  const conditionTypeName = `${conditionName}.type`;
  const conditionPayloadName = `${conditionName}.payload`;
  const conditionPayloadSelectionName = `${conditionPayloadName}.optionValue`;

  const [conditions, items, reports, conditionItem, conditionType, conditionPayload] = useWatch({
    name: [
      conditionsName,
      itemsName,
      reportsName,
      conditionItemName,
      conditionTypeName,
      conditionPayloadName,
    ],
  });
  const scores = reports?.filter((report: ScoreOrSection) => report.type === ScoreReportType.Score);
  const groupedItems = getObjectFromList<ItemFormValues>(items);
  const conditionItemResponseType = groupedItems[conditionItem]?.responseType;

  const selectedItem = groupedItems[conditionItem];
  const selectedScore =
    scores?.find((score: ScoreReport) => getEntityKey(score, false) === scoreKey) ?? {};
  const options = {
    [ConditionRowType.Item]: getItemOptions(
      items,
      type,
      isItemFlow,
      enableItemFlowItemsG2,
      enableItemFlowItemsG3,
    ),
    [ConditionRowType.Section]: [
      ...getItemOptions(items, type, isItemFlow, enableItemFlowItemsG2, enableItemFlowItemsG3),
      ...((scores?.length && getScoreOptions(scores)) || []),
      ...((scores?.length && getScoreConditionalsOptions(scores)) || []),
    ],
    [ConditionRowType.Score]: [getScoreIdOption(selectedScore)],
  } as Record<ConditionRowType, ConditionItem[]>;

  const handleChangeConditionItemName = useCallback(
    (event: SelectEvent) => {
      const selectedItemKey = event.target.value;
      const selectedItem = items?.find(
        (item: ItemFormValues) => getEntityKey(item) === selectedItemKey,
      );
      const selectedItemIndex = items?.indexOf(selectedItem);

      clearErrors(conditionItemName);

      if (conditionItemResponseType !== selectedItem?.responseType) {
        setValue(conditionTypeName, '', {
          shouldTouch: false,
          shouldValidate: false,
          shouldDirty: false,
        });
        setValue(conditionPayloadName, {}, {
          shouldTouch: false,
          shouldValidate: false,
          shouldDirty: false,
        });
      }

      if (selectedItemIndex !== undefined && selectedItemIndex !== -1) {
        setValue(`${activityName}.items.${selectedItemIndex}.isHidden`, false);
      }

      if (autoTrigger) {
        trigger(`${name}.itemKey`);
      }
    },
    [items, conditionItemResponseType, name, autoTrigger, clearErrors, conditionItemName],
  );

  const handleChangeConditionType = useCallback(
    (e: SelectEvent) => {
      const conditionType = e.target.value as ConditionType;

      clearErrors(conditionTypeName);

      if (!CONDITION_TYPES_TO_HAVE_OPTION_ID.includes(conditionType)) {
        clearErrors(conditionPayloadSelectionName);
      }

      if (onChangeConditionType) {
        return onChangeConditionType({
          conditionType,
          conditionPayload,
          conditionPayloadName,
          selectedItem,
        });
      }

      const payload = getPayload({ conditionType, conditionPayload, selectedItem });
      setValue(conditionPayloadName, payload, {
        shouldTouch: false,
        shouldValidate: false,
        shouldDirty: false,
      });
    },
    [
      name,
      conditionPayload,
      selectedItem,
      onChangeConditionType,
      clearErrors,
      conditionTypeName,
      conditionPayloadSelectionName,
      conditionPayloadName,
      setValue,
    ],
  );

  const handleChangeConditionValue = useCallback(() => {
    clearErrors(conditionPayloadSelectionName);
  }, [clearErrors, conditionPayloadSelectionName]);

  const handleRemove = useCallback(onRemove, [index]);

  const itemOptions = useMemo(() => options[type], [type, scores, items, selectedScore]);
  const valueOptions = useMemo(() => getValueOptionsList(selectedItem), [selectedItem]);

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
        itemName={conditionItemName}
        stateName={conditionTypeName}
        payloadName={conditionPayloadName}
        itemOptions={itemOptions}
        valueOptions={valueOptions}
        item={conditionItem}
        state={conditionType}
        isRemoveVisible={conditions?.length > 1}
        onItemChange={handleChangeConditionItemName}
        onStateChange={handleChangeConditionType}
        onRemove={handleRemove}
        type={type}
        data-testid={dataTestid}
      />
      {errorMessage && (
        <StyledErrorText sx={{ mt: theme.spacing(0.6) }}>{errorMessage}</StyledErrorText>
      )}
    </>
  );
};
