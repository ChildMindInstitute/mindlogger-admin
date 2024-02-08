import { useCallback } from 'react';

import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useCustomFormContext } from 'modules/Builder/hooks';
import { ItemFormValues } from 'modules/Builder/types';
import { StyledTitleMedium } from 'shared/styles';
import { StyledSummaryRow, StyledSummarySelectController } from 'shared/styles/styledComponents/ConditionalSummary';
import { SelectEvent } from 'shared/types';
import { getEntityKey } from 'shared/utils';

import { SummaryRowProps } from './SummaryRow.types';
import { getItemsOptions, getMatchOptions } from './SummaryRow.utils';

export const SummaryRow = ({ name, activityName, 'data-testid': dataTestid }: SummaryRowProps) => {
  const { t } = useTranslation('app');
  const { control, setValue } = useCustomFormContext();

  const items = useWatch({ name: `${activityName}.items` });

  const handleChangeItemKey = useCallback(
    (event: SelectEvent) => {
      const itemIndex = items?.findIndex((item: ItemFormValues) => getEntityKey(item) === event.target.value);

      if (itemIndex !== undefined && itemIndex !== -1 && items[itemIndex]?.isHidden)
        setValue(`${activityName}.items.${itemIndex}.isHidden`, false);
    },
    [items],
  );

  return (
    <>
      <StyledSummaryRow data-testid={dataTestid}>
        <StyledTitleMedium>{t('if')}</StyledTitleMedium>
        <StyledSummarySelectController
          control={control}
          name={`${name}.match`}
          options={getMatchOptions()}
          placeholder={t('select')}
          data-testid={`${dataTestid}-match`}
          isLabelNeedTranslation={false}
        />
        <StyledTitleMedium>{t('summaryRowDescription')}</StyledTitleMedium>
        <StyledSummarySelectController
          control={control}
          name={`${name}.itemKey`}
          options={getItemsOptions(items)}
          placeholder={t('conditionItemNamePlaceholder')}
          SelectProps={{
            renderValue: (value: unknown) => {
              const itemName = items?.find((item: ItemFormValues) => getEntityKey(item) === value)?.name;

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
