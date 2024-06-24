import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useWatch } from 'react-hook-form';

import { StyledTitleMedium } from 'shared/styles';
import { getEntityKey } from 'shared/utils';
import { SelectEvent } from 'shared/types';
import { ItemFormValues } from 'modules/Builder/types';
import {
  StyledSummaryRow,
  StyledSummarySelectController,
} from 'shared/styles/styledComponents/ConditionalSummary';
import { useCustomFormContext } from 'modules/Builder/hooks';

import { SummaryRowProps } from './SummaryRow.types';
import { getItemsOptions, getMatchOptions } from './SummaryRow.utils';
import { useItemsInUsage } from './SummaryRow.hooks';

export const SummaryRow = ({ name, activityName, 'data-testid': dataTestid }: SummaryRowProps) => {
  const { t } = useTranslation('app');
  const { control, setValue } = useCustomFormContext();
  const [items, conditions] = useWatch({
    name: [`${activityName}.items`, `${name}.conditions`],
  });
  const itemsInUsage = useItemsInUsage(name);

  const handleChangeItemKey = useCallback(
    (event: SelectEvent) => {
      const itemIndex = items?.findIndex(
        (item: ItemFormValues) => getEntityKey(item) === event.target.value,
      );

      if (itemIndex !== undefined && itemIndex !== -1 && items[itemIndex]?.isHidden)
        setValue(`${activityName}.items.${itemIndex}.isHidden`, false);
    },
    [items, activityName, setValue],
  );

  const matchOptions = useMemo(() => getMatchOptions({ conditions, items }), [conditions, items]);
  const itemsOptions = useMemo(
    () => getItemsOptions({ items, itemsInUsage, conditions }),
    [items, itemsInUsage, conditions],
  );

  return (
    <>
      <StyledSummaryRow data-testid={dataTestid}>
        <StyledTitleMedium>{t('if')}</StyledTitleMedium>
        <StyledSummarySelectController
          control={control}
          name={`${name}.match`}
          options={matchOptions}
          placeholder={t('select')}
          data-testid={`${dataTestid}-match`}
          isLabelNeedTranslation={false}
        />
        <StyledTitleMedium>{t('summaryRowDescription')}</StyledTitleMedium>
        <StyledSummarySelectController
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
          isLabelNeedTranslation={false}
        />
      </StyledSummaryRow>
    </>
  );
};
