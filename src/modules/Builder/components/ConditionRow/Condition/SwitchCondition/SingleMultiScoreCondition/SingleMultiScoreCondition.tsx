import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

import { useCustomFormContext } from 'modules/Builder/hooks/useCustomFormContext';

import { ConditionItemType } from '../../Condition.const';
import { StyledSelectController } from '../../Condition.styles';
import { getScoreConditionOptions } from '../../Condition.utils';
import { SingleMultiScoreConditionProps } from './SingleMultiScoreCondition.types';

export const SingleMultiScoreCondition = ({
  children,
  selectedItem,
  payloadName,
  valueOptions,
  dataTestid,
}: SingleMultiScoreConditionProps) => {
  const { t } = useTranslation('app');
  const { control, clearErrors } = useCustomFormContext();

  const optionValueName = `${payloadName}.optionValue`;
  const numberValueName = `${payloadName}.value`;
  const isItemScoreCondition = selectedItem?.type === ConditionItemType.ScoreCondition;
  const isValueSelectDisabled = !isItemScoreCondition && !valueOptions?.length;

  const handleValueChange = useCallback(() => {
    clearErrors(optionValueName);
  }, [clearErrors, optionValueName]);

  return (
    <>
      {children}
      <StyledSelectController
        control={control}
        name={isItemScoreCondition ? numberValueName : optionValueName}
        options={isItemScoreCondition ? getScoreConditionOptions() : valueOptions}
        placeholder={isValueSelectDisabled ? t('conditionDisabledPlaceholder') : t('value')}
        isLabelNeedTranslation={false}
        data-testid={`${dataTestid}-selection-value`}
        disabled={isValueSelectDisabled}
        customChange={handleValueChange}
      />
    </>
  );
};
