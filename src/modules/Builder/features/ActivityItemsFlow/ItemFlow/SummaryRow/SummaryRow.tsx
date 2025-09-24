import { useCallback, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useWatch } from 'react-hook-form';

import { StyledTitleMedium } from 'shared/styles';
import { getEntityKey } from 'shared/utils';
import { SelectEvent } from 'shared/types';
import { ItemFlowSelectController } from 'modules/Builder/components/ItemFlowSelectController/ItemFlowSelectController';
import { ItemFormValues } from 'modules/Builder/types';
import { StyledSummaryRow } from 'shared/styles/styledComponents/ConditionalSummary';
import { useCustomFormContext } from 'modules/Builder/hooks';
import { ConditionalLogicMatch } from 'shared/consts';
import { Condition } from 'shared/state/Applet';

import { SummaryRowProps } from './SummaryRow.types';
import { getItemsOptions, getMatchOptions } from './utils';
import { useItemsInUsage } from './SummaryRow.hooks';

export const SummaryRow = ({ name, activityName, 'data-testid': dataTestid }: SummaryRowProps) => {
  const { t } = useTranslation('app');
  const { control, setValue, getValues, clearErrors } = useCustomFormContext();
  const matchFieldName = `${name}.match`;
  const itemKeyFieldName = `${name}.itemKey`;
  const [items, conditions, match]: [ItemFormValues[], Condition[], ConditionalLogicMatch] =
    useWatch({
      name: [`${activityName}.items`, `${name}.conditions`, matchFieldName],
    });
  const itemsInUsage = useItemsInUsage(name);

  const handleChangeItemKey = useCallback(
    (event: SelectEvent) => {
      const itemIndex = items?.findIndex((item) => getEntityKey(item) === event.target.value);

      clearErrors(itemKeyFieldName);

      if (itemIndex !== undefined && itemIndex !== -1 && items[itemIndex]?.isHidden)
        setValue(`${activityName}.items.${itemIndex}.isHidden`, false);
    },
    [items, activityName, setValue, clearErrors, itemKeyFieldName],
  );

  const handleChangeMatch = useCallback(() => {
    clearErrors(matchFieldName);
  }, [clearErrors, matchFieldName]);

  const matchOptions = useMemo(() => getMatchOptions({ conditions, items }), [conditions, items]);
  const itemsOptions = useMemo(
    () => getItemsOptions({ items, itemsInUsage, conditions }),
    [items, itemsInUsage, conditions],
  );
  const { question } = (items ?? []).find(({ id }) => id === getValues(itemKeyFieldName)) ?? {};

  useEffect(() => {
    // If there are contradictory conditions, change the value of the match option from 'All' to 'Any'
    const needMatchValueChange = matchOptions[1].disabled && match === ConditionalLogicMatch.All;
    if (needMatchValueChange) {
      setValue(matchFieldName, ConditionalLogicMatch.Any);
    }
  }, [matchOptions, match, matchFieldName, setValue]);

  return (
    <>
      <StyledSummaryRow data-testid={dataTestid}>
        <StyledTitleMedium>{t('if')}</StyledTitleMedium>

        <ItemFlowSelectController
          control={control}
          name={matchFieldName}
          options={matchOptions}
          placeholder={t('select')}
          data-testid={`${dataTestid}-match`}
          isLabelNeedTranslation={false}
          customChange={handleChangeMatch}
        />

        <StyledTitleMedium>{t('summaryRowDescription')}</StyledTitleMedium>

        <ItemFlowSelectController
          control={control}
          name={itemKeyFieldName}
          options={itemsOptions}
          placeholder={t('conditionItemNamePlaceholder')}
          SelectProps={{
            renderValue: (value: unknown) => {
              const itemName = items?.find((item: ItemFormValues) => getEntityKey(item) === value)
                ?.name;

              return <span>{t('conditionItemSelected', { value: itemName })}</span>;
            },
          }}
          customChange={handleChangeItemKey}
          data-testid={`${dataTestid}-item`}
          tooltipTitle={question}
        />
      </StyledSummaryRow>
    </>
  );
};
