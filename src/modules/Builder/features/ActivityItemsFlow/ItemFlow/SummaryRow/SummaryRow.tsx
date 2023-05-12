import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { StyledTitleMedium } from 'shared/styles';
import { getEntityKey } from 'shared/utils';
import { useCurrentActivity } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.hooks';
import { ItemFormValues } from 'modules/Builder';

import { StyledSummaryRow, StyledSelectController } from './SummaryRow.styles';
import { SummaryRowProps } from './SummaryRow.types';
import { getMatchOptions, getItemsOptions } from './SummaryRow.utils';

export const SummaryRow = ({ name }: SummaryRowProps) => {
  const { t } = useTranslation('app');
  const { control, watch } = useFormContext();

  const { fieldName } = useCurrentActivity();
  const items = watch(`${fieldName}.items`);

  return (
    <StyledSummaryRow>
      <StyledTitleMedium>{t('if')}</StyledTitleMedium>
      <StyledSelectController
        control={control}
        name={`${name}.match`}
        options={getMatchOptions()}
        placeholder={t('select')}
      />
      <StyledTitleMedium>{t('summaryRowDescription')}</StyledTitleMedium>
      <StyledSelectController
        control={control}
        name={`${name}.itemKey`}
        options={getItemsOptions(items)}
        placeholder={t('conditionItemNamePlaceholder')}
        SelectProps={{
          renderValue: (value: unknown) => {
            const itemName = items?.find(
              (item: ItemFormValues) => getEntityKey(item) === value,
            )?.name;

            return <span>{t('conditionItemNameSelected', { value: itemName })}</span>;
          },
        }}
      />
    </StyledSummaryRow>
  );
};
