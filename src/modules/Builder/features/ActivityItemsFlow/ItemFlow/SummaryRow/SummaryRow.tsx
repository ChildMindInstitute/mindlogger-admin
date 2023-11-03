import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { StyledTitleMedium } from 'shared/styles';
import { getEntityKey } from 'shared/utils';
import { SelectEvent } from 'shared/types';
import { useCurrentActivity } from 'modules/Builder/hooks';
import { ItemFormValues } from 'modules/Builder/types';
import {
  StyledSummaryRow,
  StyledSummarySelectController,
} from 'shared/styles/styledComponents/ConditionalSummary';

import { SummaryRowProps } from './SummaryRow.types';
import { getMatchOptions, getItemsOptions } from './SummaryRow.utils';

export const SummaryRow = ({ name, 'data-testid': dataTestid }: SummaryRowProps) => {
  const { t } = useTranslation('app');
  const { control, watch, setValue, trigger } = useFormContext();

  const { fieldName } = useCurrentActivity();
  const items = watch(`${fieldName}.items`);

  const handleChangeItemKey = (event: SelectEvent) => {
    trigger(`${name}.itemKey`);

    const itemIndex = items?.findIndex(
      (item: ItemFormValues) => getEntityKey(item) === event.target.value,
    );

    if (itemIndex !== undefined && itemIndex !== -1) {
      setValue(`${fieldName}.items.${itemIndex}.isHidden`, false);
    }
  };

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
        />
        <StyledTitleMedium>{t('summaryRowDescription')}</StyledTitleMedium>
        <StyledSummarySelectController
          control={control}
          name={`${name}.itemKey`}
          options={getItemsOptions(items)}
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
        />
      </StyledSummaryRow>
    </>
  );
};
