import { useRef, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import {
  StyledBodyLarge,
  StyledHeadlineLarge,
  StyledFlexTopCenter,
  StyledClearedButton,
  theme,
} from 'shared/styles';
import { Svg, Tooltip } from 'shared/components';
import { CheckboxController } from 'shared/components/FormComponents';
import { useHeaderSticky } from 'shared/hooks';

import {
  StyledHeader,
  StyledContent,
  StyledScoresAndReports,
  StyledScoreSummaryTooltipSvg,
} from './ScoresAndReports.styles';

export const ScoresAndReports = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation('app');

  const containerRef = useRef<HTMLElement | null>(null);

  const { control } = useFormContext();

  const isHeaderSticky = useHeaderSticky(containerRef);

  return (
    <StyledScoresAndReports ref={containerRef}>
      <StyledHeader isSticky={isHeaderSticky}>
        <StyledHeadlineLarge>{t('scoresAndReports')}</StyledHeadlineLarge>
        <StyledClearedButton sx={{ p: theme.spacing(1) }}>
          <Svg id="close" />
        </StyledClearedButton>
      </StyledHeader>
      <StyledContent>
        <CheckboxController
          control={control}
          name="generateReport"
          label={<StyledBodyLarge>{t('generateReport')}</StyledBodyLarge>}
        />
        <CheckboxController
          control={control}
          name="showScoreSummary"
          label={
            <StyledFlexTopCenter>
              <StyledBodyLarge>{t('showScoreSummary')}</StyledBodyLarge>
              <Tooltip tooltipTitle={t('showScoreSummaryTooltip')}>
                <StyledFlexTopCenter>
                  <StyledScoreSummaryTooltipSvg id="more-info-outlined" width="20" height="20" />
                </StyledFlexTopCenter>
              </Tooltip>
            </StyledFlexTopCenter>
          }
        />
        {children}
      </StyledContent>
    </StyledScoresAndReports>
  );
};
