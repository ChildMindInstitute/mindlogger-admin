import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext, useWatch } from 'react-hook-form';

import { StyledTitleMedium } from 'shared/styles';
import { getEntityKey, getObjectFromList } from 'shared/utils';
import { SelectEvent } from 'shared/types';
import { ItemFormValues } from 'modules/Builder/types';
import {
  StyledSummaryRow,
  StyledSummarySelectController,
} from 'shared/styles/styledComponents/ConditionalSummary';

import { SummaryRowProps } from './SummaryRow.types';
import { getItemsOptions, getMatchOptions } from './SummaryRow.utils';

export const SummaryRow = ({ name, activityName, 'data-testid': dataTestid }: SummaryRowProps) => {
  const { t } = useTranslation('app');
  const { control, setValue } = useFormContext();

  const items = useWatch({ name: `${activityName}.items` });
  const groupedItems = useMemo(() => getObjectFromList<ItemFormValues>(items), [items]);

  const handleChangeItemKey = useCallback(
    (e: SelectEvent) => {
      const itemIndex = items?.findIndex(
        (item: ItemFormValues) => getEntityKey(item) === e.target.value,
      );

      if (itemIndex !== -1 && items[itemIndex]?.isHidden) {
        setValue(`${activityName}.items.${itemIndex}.isHidden`, false);
      }
    },
    [items],
  );

  const matchOptions = useMemo(() => getMatchOptions(), []);
  const itemsOptions = useMemo(() => getItemsOptions(items), [items]);
  const selectProps = useMemo(
    () => ({
      renderValue: (value: unknown) => {
        const itemName = groupedItems[value as string]?.name;

        return <span>{t('conditionItemSelected', { value: itemName })}</span>;
      },
    }),
    [groupedItems],
  );

  return (
    <StyledSummaryRow data-testid={dataTestid}>
      <StyledTitleMedium>{t('if')}</StyledTitleMedium>
      <StyledSummarySelectController
        control={control}
        name={`${name}.match`}
        options={matchOptions}
        placeholder={t('select')}
        data-testid={`${dataTestid}-match`}
      />
      <StyledTitleMedium>{t('summaryRowDescription')}</StyledTitleMedium>
      <StyledSummarySelectController
        control={control}
        name={`${name}.itemKey`}
        options={itemsOptions}
        placeholder={t('conditionItemNamePlaceholder')}
        SelectProps={selectProps}
        customChange={handleChangeItemKey}
        data-testid={`${dataTestid}-item`}
      />
    </StyledSummaryRow>
  );
};
