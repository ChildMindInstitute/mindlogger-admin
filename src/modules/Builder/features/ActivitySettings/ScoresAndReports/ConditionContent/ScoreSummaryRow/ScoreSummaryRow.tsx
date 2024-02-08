import { useTranslation } from 'react-i18next';

import { useCustomFormContext } from 'modules/Builder/hooks';
import { StyledLabelBoldLarge } from 'shared/styles';
import { StyledSummaryRow, StyledSummarySelectController } from 'shared/styles/styledComponents/ConditionalSummary';

import { ScoreSummaryRowProps } from './ScoreSummaryRow.types';
import { getMatchOptions } from './ScoreSummaryRow.utils';

export const ScoreSummaryRow = ({ name, 'data-testid': dataTestid }: ScoreSummaryRowProps) => {
  const { t } = useTranslation('app');
  const { control } = useCustomFormContext();

  return (
    <StyledSummaryRow>
      <StyledLabelBoldLarge>{t('if')}</StyledLabelBoldLarge>
      <StyledSummarySelectController
        control={control}
        name={`${name}.match`}
        options={getMatchOptions()}
        placeholder={t('select')}
        data-testid={`${dataTestid}-match`}
      />
      <StyledLabelBoldLarge>{t('scoreSummaryDescription')}</StyledLabelBoldLarge>
    </StyledSummaryRow>
  );
};
