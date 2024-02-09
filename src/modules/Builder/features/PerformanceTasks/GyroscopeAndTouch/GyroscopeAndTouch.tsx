import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useCurrentActivity } from 'modules/Builder/hooks';
import { StyledHeadlineLarge, StyledTitleLarge, theme } from 'shared/styles';

import { Instruction } from '../Instruction';
import { NameDescription } from '../NameDescription';
import { StyledPerformanceTaskBody } from '../PerformanceTasks.styles';
import { GeneralSettings } from './GeneralSettings';
import { GyroscopeAndTouchProps } from './GyroscopeAndTouch.types';

export const GyroscopeAndTouch = ({ type }: GyroscopeAndTouchProps) => {
  const { t } = useTranslation();
  const { fieldName } = useCurrentActivity();

  const dataTestid = 'builder-activity-gyroscope-and-touch';

  return (
    <Box sx={{ overflowY: 'auto' }}>
      <StyledPerformanceTaskBody sx={{ p: theme.spacing(2.4, 6.4) }}>
        <StyledHeadlineLarge sx={{ mb: theme.spacing(3) }}>{t(type || '')}</StyledHeadlineLarge>
        <NameDescription />
        <GeneralSettings />
        <StyledTitleLarge sx={{ mb: theme.spacing(2.4) }}>{t('instructions')}</StyledTitleLarge>
        <Instruction
          name={`${fieldName}.items.0.question`}
          title={t('gyroscopeAndTouchInstructions.overview.title')}
          description={t('gyroscopeAndTouchDesc.overview')}
          instructionId="instruction-0"
          data-testid={`${dataTestid}-overview-instruction`}
        />
        <Instruction
          name={`${fieldName}.items.1.question`}
          title={t('gyroscopeAndTouchInstructions.practice.title')}
          description={t('gyroscopeAndTouchDesc.practice')}
          instructionId="instruction-1"
          data-testid={`${dataTestid}-practice-round-instruction`}
        />
        <Instruction
          name={`${fieldName}.items.3.question`}
          title={t('gyroscopeAndTouchInstructions.test.title')}
          description={t('gyroscopeAndTouchDesc.test')}
          instructionId="instruction-3"
          data-testid={`${dataTestid}-test-round-instruction`}
        />
      </StyledPerformanceTaskBody>
    </Box>
  );
};
