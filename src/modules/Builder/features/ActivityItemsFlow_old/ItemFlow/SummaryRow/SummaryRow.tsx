import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useWatch } from 'react-hook-form';

import { StyledTitleMedium } from 'shared/styles';
import { getEntityKey } from 'shared/utils';
import { SelectEvent } from 'shared/types';
import { ItemFlowSelectController } from 'modules/Builder/components/ItemFlowSelectController/ItemFlowSelectController';
import { ItemFormValues } from 'modules/Builder/types';
import { StyledSummaryRow } from 'shared/styles/styledComponents/ConditionalSummary';
import { useCustomFormContext } from 'modules/Builder/hooks';
import { Condition } from 'shared/state/Applet';

import { SummaryRowProps } from './SummaryRow.types';
import { getItemsOptions, getMatchOptions } from './SummaryRow.utils';
import { useItemsInUsage } from './SummaryRow.hooks';

export const SummaryRow = ({ name, activityName, 'data-testid': dataTestid }: SummaryRowProps) => {
  const { t } = useTranslation('app');
  const { control, setValue, getValues } = useCustomFormContext();
  const [items, conditions]: [ItemFormValues[], Condition[]] = useWatch({
    name: [`${activityName}.items`, `${name}.conditions`],
  });
  const itemsInUsage = useItemsInUsage(name);

  const handleChangeItemKey = useCallback(
    (event: SelectEvent) => {
      const itemIndex = items?.findIndex((item) => getEntityKey(item) === event.target.value);

      if (itemIndex !== undefined && itemIndex !== -1 && items[itemIndex]?.isHidden)
        setValue(`${activityName}.items.${itemIndex}.isHidden`, false);
    },
    [items, activityName, setValue],
  );

  const itemsOptions = useMemo(
    () => getItemsOptions({ items, itemsInUsage, conditions }),
    [items, itemsInUsage, conditions],
  );

  const { question } = (items ?? []).find(({ id }) => id === getValues(`${name}.itemKey`)) ?? {};

  return (
    <>
      <StyledSummaryRow data-testid={dataTestid}>
        <StyledTitleMedium>{t('if')}</StyledTitleMedium>
        <ItemFlowSelectController
          control={control}
          name={`${name}.match`}
          options={getMatchOptions()}
          placeholder={t('select')}
          data-testid={`${dataTestid}-match`}
        />
        <StyledTitleMedium>{t('summaryRowDescription')}</StyledTitleMedium>
        <ItemFlowSelectController
          control={control}
          name={`${name}.itemKey`}
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
