import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { StyledTitleMedium } from 'shared/styles';
import { getEntityKey } from 'shared/utils';
import { useCurrentActivity } from 'modules/Builder/hooks';
import { ItemFormValues } from 'modules/Builder/types';

import { StyledSummaryRow, StyledSelectController } from './ScoreSummaryRow.styles';
import { ScoreSummaryRowProps } from './ScoreSummaryRow.types';
import { getMatchOptions } from './ScoreSummaryRow.utils';

export const ScoreSummaryRow = ({ name }: ScoreSummaryRowProps) => {
  const { t } = useTranslation('app');
  const { control, watch, setValue } = useFormContext();

  const { fieldName } = useCurrentActivity();
  const items = watch(`${fieldName}.items`);
  const selectedItem = watch(`${name}.itemKey`);

  useEffect(() => {
    if (!selectedItem) return;

    const itemIndex = items?.findIndex(
      (item: ItemFormValues) => getEntityKey(item) === selectedItem,
    );

    if (itemIndex !== -1) setValue(`${fieldName}.items.${itemIndex}.isHidden`, false);
  }, [selectedItem]);

  return (
    <StyledSummaryRow>
      <StyledTitleMedium>{t('if')}</StyledTitleMedium>
      <StyledSelectController
        control={control}
        name={`${name}.match`}
        options={getMatchOptions()}
        placeholder={t('select')}
      />
      <StyledTitleMedium>{t('scoreSummaryDescription')}</StyledTitleMedium>
    </StyledSummaryRow>
  );
};
