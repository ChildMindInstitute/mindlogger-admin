import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { addDays } from 'date-fns';
import { useCallback } from 'react';

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
  const typeName = `${payloadName}.type`;
  const rowIndexName = `${payloadName}.rowIndex`;
  const { t } = useTranslation('app');
  const { control, setValue } = useCustomFormContext();
  const { fieldName: activityName } = useCurrentActivity();
  const itemsName = `${activityName}.items`;
  const [minValue, maxValue, conditionPayload, items, conditionItem] = useWatch({
    name: [minValueName, maxValueName, payloadName, itemsName, itemName],
  });
  const groupedItems = getObjectFromList<ItemFormValues>(items);
  const selectedItemForm = groupedItems[conditionItem];

  const isSingleValueShown = !CONDITION_TYPES_TO_HAVE_RANGE_VALUE.includes(state);
  const isRangeValueShown = !isSingleValueShown;
  const isItemSelected = !!selectedItem;
  const itemType = selectedItem?.type;

  const commonTimeConditionProps = {
    numberValueName,
    minValueName,
    maxValueName,
    maxValue,
    isSingleValueShown,
    isRangeValueShown,
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

  const handleChangeSubstate = useCallback(
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
            customChange={handleChangeSubstate(itemType)}
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
            customChange={handleChangeSubstate(itemType)}
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
        if (!minValue || !maxValue) return;
        if (maxValue < minValue) {
          setValue(maxValueName, addDays(minValue, 1));
        }
      };

      return (
        <>
          {children}
          {isSingleValueShown && (
            <StyledFlexTopCenter>
              <DatePicker
                name={numberValueName}
                data-testid={`${dataTestid}-date-value`}
                skipMinDate
                {...commonDateInputProps}
              />
            </StyledFlexTopCenter>
          )}
          {isRangeValueShown && (
            <StyledFlexTopCenter>
              <DatePicker
                name={minValueName}
                key={`min-date-value-${isRangeValueShown}`}
                onCloseCallback={onCloseStartDateCallback}
                data-testid={`${dataTestid}-start-date-value`}
                skipMinDate
                {...commonDateInputProps}
              />
              <StyledBodyLarge sx={{ m: theme.spacing(0, 0.4) }}>{t('and')}</StyledBodyLarge>
              <DatePicker
                name={maxValueName}
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
            customChange={handleChangeSubstate(itemType)}
          />
          {children}
          <TimeCondition {...commonTimeConditionProps} />
        </>
      );
    default:
      return null;
  }
};
