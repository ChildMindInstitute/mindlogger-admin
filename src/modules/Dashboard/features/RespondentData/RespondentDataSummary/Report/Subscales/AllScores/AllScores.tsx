import { Box } from '@mui/material';
import uniqueId from 'lodash.uniqueid';
import { useTranslation } from 'react-i18next';

import { TScoreSeverity } from 'modules/Builder/features/ActivitySettings/SubscalesConfiguration/LookupTable';
import { useFeatureFlags } from 'shared/hooks';
import {
  StyledBodyMedium,
  StyledFlexAllCenter,
  StyledFlexTopCenter,
  StyledFlexTopStart,
  StyledHeadlineSmall,
  theme,
  variables,
} from 'shared/styles';

import { SubscaleLineChart } from '../../Charts/LineChart';
import { getSeveritySvg } from '../../Charts/LineChart/SubscaleLineChart/SubscaleLineChart.utils';
import { AllScoresProps } from './AllScores.types';

const StringDivider = <StyledBodyMedium sx={{ m: theme.spacing(0, 0.8) }}>∙</StyledBodyMedium>;

export const AllScores = ({
  data,
  latestFinalScore,
  frequency,
  versions,
  'data-testid': dataTestId,
}: AllScoresProps) => {
  const { t } = useTranslation('app');
  const { featureFlags } = useFeatureFlags();

  if (!data.subscales.length) return null;

  const LegendIcons = TScoreSeverity.map((severity) => (
    <StyledFlexAllCenter sx={{ gap: theme.spacing(0.8) }} key={uniqueId()}>
      <div
        style={{ width: theme.spacing(2.4), height: theme.spacing(2.4) }}
        dangerouslySetInnerHTML={{
          __html: getSeveritySvg(severity, variables.palette.outline),
        }}
      />
      <StyledBodyMedium>{severity || 'Default'}</StyledBodyMedium>
    </StyledFlexAllCenter>
  ));

  return (
    <Box sx={{ mb: theme.spacing(2.4) }} data-testid={`${dataTestId}-container`}>
      <StyledHeadlineSmall sx={{ mb: theme.spacing(0.8), color: variables.palette.on_surface }}>
        {t('subscaleScores')}
      </StyledHeadlineSmall>
      <StyledFlexTopStart>
        {!!latestFinalScore && (
          <>
            <StyledBodyMedium data-testid={`${dataTestId}-latest-final-subscale-score`}>
              {t('latestFinalSubscaleScore')}: {latestFinalScore}
            </StyledBodyMedium>
            {StringDivider}
          </>
        )}
        {!!frequency && (
          <StyledBodyMedium data-testid={`${dataTestId}-frequency`}>
            {t('frequency')}: {frequency}
          </StyledBodyMedium>
        )}
      </StyledFlexTopStart>
      <SubscaleLineChart data={data} versions={versions} />
      {featureFlags.enableCahmiSubscaleScoring && (
        <StyledFlexTopCenter
          sx={{ justifyContent: 'flex-start', gap: theme.spacing(1.6) }}
          data-testid={`${dataTestId}-line-chart-legend`}
        >
          <StyledBodyMedium sx={{ lineHeight: theme.spacing(2.4) }}>{t('key')}:</StyledBodyMedium>
          {LegendIcons}
        </StyledFlexTopCenter>
      )}
    </Box>
  );
};
