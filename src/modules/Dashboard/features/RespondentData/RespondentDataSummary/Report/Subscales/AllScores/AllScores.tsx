import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import uniqueId from 'lodash.uniqueid';

import {
  StyledBodyMedium,
  StyledFlexAllCenter,
  StyledFlexTopCenter,
  StyledFlexTopStart,
  StyledHeadline,
  theme,
  variables,
} from 'shared/styles';
import { TScoreSeverity } from 'modules/Builder/features/ActivitySettings/SubscalesConfiguration/LookupTable';
import { useFeatureFlags } from 'shared/hooks';

import { SubscaleLineChart } from '../../Charts/LineChart';
import { AllScoresProps } from './AllScores.types';
import { getSeveritySvg } from '../../Charts/LineChart/SubscaleLineChart/SubscaleLineChart.utils';

const StringDivider = <StyledBodyMedium sx={{ m: theme.spacing(0, 0.8) }}>∙</StyledBodyMedium>;

export const AllScores = ({ data, latestFinalScore, frequency, versions }: AllScoresProps) => {
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
    <Box sx={{ mb: theme.spacing(2.4) }} data-testid="all-scores">
      <StyledHeadline sx={{ mb: theme.spacing(0.8), color: variables.palette.on_surface }}>
        {t('subscaleScores')}
      </StyledHeadline>
      <StyledFlexTopStart>
        {!!latestFinalScore && (
          <>
            <StyledBodyMedium data-testid="latest-final-subscale-score">
              {t('latestFinalSubscaleScore')}: {latestFinalScore}
            </StyledBodyMedium>
            {StringDivider}
          </>
        )}
        {!!frequency && (
          <StyledBodyMedium data-testid="frequency">
            {t('frequency')}: {frequency}
          </StyledBodyMedium>
        )}
      </StyledFlexTopStart>
      <SubscaleLineChart data={data} versions={versions} />
      {featureFlags.enableCahmiSubscaleScoring && (
        <StyledFlexTopCenter
          className="line-chart-legend"
          sx={{ justifyContent: 'flex-start', gap: theme.spacing(1.6) }}
        >
          <StyledBodyMedium sx={{ lineHeight: theme.spacing(2.4) }}>{t('key')}:</StyledBodyMedium>
          {LegendIcons}
        </StyledFlexTopCenter>
      )}
    </Box>
  );
};
