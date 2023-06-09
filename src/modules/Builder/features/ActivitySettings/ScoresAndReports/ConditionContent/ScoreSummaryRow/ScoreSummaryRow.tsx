import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { StyledTitleMedium } from 'shared/styles';
import {
  StyledSummaryRow,
  StyledSummarySelectController,
} from 'shared/styles/styledComponents/ConditionalSummary';

import { ScoreSummaryRowProps } from './ScoreSummaryRow.types';
import { getMatchOptions } from './ScoreSummaryRow.utils';

export const ScoreSummaryRow = ({ name }: ScoreSummaryRowProps) => {
  const { t } = useTranslation('app');
  const { control } = useFormContext();

  return (
    <StyledSummaryRow>
      <StyledTitleMedium>{t('if')}</StyledTitleMedium>
      <StyledSummarySelectController
        control={control}
        name={`${name}.match`}
        options={getMatchOptions()}
        placeholder={t('select')}
      />
      <StyledTitleMedium>{t('scoreSummaryDescription')}</StyledTitleMedium>
    </StyledSummaryRow>
  );
};
