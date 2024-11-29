import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { addDays } from 'date-fns';
import { useCallback, useEffect } from 'react';

import { useCustomFormContext } from 'modules/Builder/hooks/useCustomFormContext';
import { DatePicker } from 'shared/components/DatePicker';
import { CONDITION_TYPES_TO_HAVE_RANGE_VALUE } from 'shared/consts';
import { StyledBodyLarge, StyledFlexTopCenter, theme } from 'shared/styles';
import { useCurrentActivity } from 'modules/Builder/hooks';
import { ItemFormValues } from 'modules/Builder/types';
import { getObjectFromList } from 'shared/utils';
import { SelectEvent } from 'shared/types';

import { ConditionItemType } from '../Condition.const';
import { SwitchConditionProps } from './SwitchCondition.types';
import { getTimeRangeOptions, getRowOptions } from './SwitchCondition.utils';
import { commonInputSx, commonInputWrapperSx } from './SwitchCondition.const';
import { TimeCondition } from './TimeCondition';
import { StyledSelectController } from '../Condition.styles';
import { SingleMultiScoreCondition } from './SingleMultiScoreCondition';
import { SingleOrRangeNumberCondition } from './SingleOrRangeNumberCondition';
import { getPayload } from '../../ConditionRow.utils';

export const SwitchCondition = ({
  itemName,
  selectedItem,
  payloadName,
  state,
  dataTestid,
  children,
  valueOptions,
}: SwitchConditionProps) => {
  const numberValueName = `${payloadName}.value`;
  const minValueName = `${payloadName}.minValue`;
  const maxValueName = `${payloadName}.maxValue`;
  const dateValueName = `${payloadName}.date`;
  const minDateValueName = `${payloadName}.minDate`;
  const maxDateValueName = `${payloadName}.maxDate`;
  const timeValueName = `${payloadName}.time`;
  const minTimeValueName = `${payloadName}.minTime`;
  const maxTimeValueName = `${payloadName}.maxTime`;
  const typeName = `${payloadName}.fieldName`;
  const rowIndexName = `${payloadName}.rowIndex`;
  const { t } = useTranslation('app');
  const { control, setValue } = useCustomFormContext();
  const { fieldName: activityName } = useCurrentActivity();
  const itemsName = `${activityName}.items`;
  const [
    minValue,
    minDateValue,
    maxValue,
    maxDateValue,
    maxTimeValue,
    conditionPayload,
    items,
    conditionItem,
    dateValue,
  ] = useWatch({
    name: [
      minValueName,
      minDateValueName,
      maxValueName,
      maxDateValueName,
      maxTimeValueName,
      payloadName,
      itemsName,
      itemName,
      dateValueName,
    ],
  });

  useEffect(() => {
    if (dateValue && typeof dateValue === 'string') {
      setValue(dateValueName, new Date(`${dateValue}T00:00:00`));
    }
    if (minDateValue && typeof minDateValue === 'string') {
      setValue(minDateValueName, new Date(`${minDateValue}T00:00:00`));
    }
    if (maxDateValue && typeof maxDateValue === 'string') {
      setValue(maxDateValueName, new Date(`${maxDateValue}T00:00:00`));
    }
  }, [
    dateValue,
    minDateValue,
    maxDateValue,
    setValue,
    dateValueName,
    minDateValueName,
    maxDateValueName,
  ]);

  const groupedItems = getObjectFromList<ItemFormValues>(items);
  const selectedItemForm = groupedItems[conditionItem];

  const isSingleValueShown = !CONDITION_TYPES_TO_HAVE_RANGE_VALUE.includes(state);
  const isRangeValueShown = !isSingleValueShown;
  const isItemSelected = !!selectedItem;
  const itemType = selectedItem?.type;

  const commonTimeConditionProps = {
    timeValueName,
    minTimeValueName,
    maxTimeValueName,
    maxTimeValue,
    isSingleValueShown,
    isRangeValueShown,
    state,
    dataTestid,
  };
  const commonSingleMultiScoreConditionProps = {
    children,
    payloadName,
    valueOptions,
    dataTestid,
  };
  const commonSingleOrRangeNumberConditionProps = {
    children,
    state,
    numberValueName,
    minValueName,
    maxValueName,
    rowIndexName,
    minValue,
    maxValue,
    isSingleValueShown,
    isRangeValueShown,
    dataTestid,
  };

  const handleChangeSubState = useCallback(
    (
      selectType:
        | ConditionItemType.SingleSelectionPerRow
        | ConditionItemType.MultipleSelectionPerRow
        | ConditionItemType.SliderRows
        | ConditionItemType.TimeRange,
    ) =>
      (e: SelectEvent) => {
        if (!selectedItem) return;

        const { value } = e.target;
        const fieldName =
          selectType === ConditionItemType.TimeRange ? 'formTimeType' : 'formRowIndex';
        const payload = getPayload({
          conditionType: state,
          conditionPayload,
          selectedItem: selectedItemForm,
          [fieldName]: value,
        });

        setValue(payloadName, payload);
      },
    [setValue, selectedItem, conditionPayload, payloadName, state, selectedItemForm],
  );

  if (!itemType) return null;

  switch (itemType) {
    case ConditionItemType.SingleSelection:
    case ConditionItemType.MultiSelection:
    case ConditionItemType.ScoreCondition: {
      return (
        <SingleMultiScoreCondition
          {...commonSingleMultiScoreConditionProps}
          selectedItem={selectedItem}
        />
      );
    }
    case ConditionItemType.SingleSelectionPerRow:
    case ConditionItemType.MultipleSelectionPerRow: {
      return (
        <>
          <StyledSelectController
            control={control}
            name={rowIndexName}
            options={getRowOptions(selectedItem.responseValues.rows)}
            placeholder={!isItemSelected ? t('conditionDisabledPlaceholder') : `${t('row')}`}
            isLabelNeedTranslation={false}
            data-testid={`${dataTestid}-payload-rowIndex`}
            disabled={!isItemSelected}
            customChange={handleChangeSubState(itemType)}
          />
          <SingleMultiScoreCondition
            {...commonSingleMultiScoreConditionProps}
            selectedItem={selectedItem}
          />
        </>
      );
    }
    case ConditionItemType.SliderRows: {
      return (
        <>
          <StyledSelectController
            control={control}
            name={rowIndexName}
            options={getRowOptions(selectedItem.responseValues.rows)}
            placeholder={!isItemSelected ? t('conditionDisabledPlaceholder') : `${t('row')}`}
            isLabelNeedTranslation={false}
            data-testid={`${dataTestid}-payload-rowIndex`}
            disabled={!isItemSelected}
            customChange={handleChangeSubState(itemType)}
          />
          <SingleOrRangeNumberCondition
            {...commonSingleOrRangeNumberConditionProps}
            selectedItem={selectedItem}
          />
        </>
      );
    }
    case ConditionItemType.Score:
    case ConditionItemType.Slider:
    case ConditionItemType.NumberSelection: {
      return (
        <SingleOrRangeNumberCondition
          {...commonSingleOrRangeNumberConditionProps}
          selectedItem={selectedItem}
        />
      );
    }
    case ConditionItemType.Date: {
      const commonDateInputProps = {
        control,
        placeholder: t('datePlaceholder'),
        hideLabel: true,
        inputWrapperSx: {
          ...commonInputWrapperSx,
          minWidth: '18rem',
          width: '18rem',
        },
        inputSx: {
          ...commonInputSx,
        },
      };

      const onCloseStartDateCallback = () => {
        if (!minDateValue || !maxDateValue) return;
        if (maxDateValue < minDateValue) {
          setValue(maxDateValueName, addDays(minDateValue, 1));
        }
      };

      return (
        <>
          {children}
          {isSingleValueShown && (
            <StyledFlexTopCenter>
              <DatePicker
                name={dateValueName}
                data-testid={`${dataTestid}-date-value`}
                skipMinDate
                {...commonDateInputProps}
              />
            </StyledFlexTopCenter>
          )}
          {isRangeValueShown && (
            <StyledFlexTopCenter>
              <DatePicker
                name={minDateValueName}
                key={`min-date-value-${isRangeValueShown}`}
                onCloseCallback={onCloseStartDateCallback}
                data-testid={`${dataTestid}-start-date-value`}
                skipMinDate
                {...commonDateInputProps}
              />
              <StyledBodyLarge sx={{ m: theme.spacing(0, 0.4) }}>{t('and')}</StyledBodyLarge>
              <DatePicker
                name={maxDateValueName}
                key={`max-date-value-${isRangeValueShown}`}
                minDate={minValue as Date}
                data-testid={`${dataTestid}-end-date-value`}
                {...commonDateInputProps}
              />
            </StyledFlexTopCenter>
          )}
        </>
      );
    }
    case ConditionItemType.Time: {
      return (
        <>
          {children}
          <TimeCondition {...commonTimeConditionProps} />
        </>
      );
    }
    case ConditionItemType.TimeRange:
      return (
        <>
          <StyledSelectController
            control={control}
            name={typeName}
            options={getTimeRangeOptions()}
            placeholder={isItemSelected ? t('startEndTime') : t('conditionDisabledPlaceholder')}
            isLabelNeedTranslation={false}
            data-testid={`${dataTestid}-payload-type-value`}
            disabled={!isItemSelected}
            customChange={handleChangeSubState(itemType)}
          />
          {children}
          <TimeCondition {...commonTimeConditionProps} />
        </>
      );
    default:
      return null;
  }
};
