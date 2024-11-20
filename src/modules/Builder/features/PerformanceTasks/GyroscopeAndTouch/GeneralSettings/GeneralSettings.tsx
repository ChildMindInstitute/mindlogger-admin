import { Grid } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { StyledItemOptionContainer } from 'modules/Builder/components';
import { useCurrentActivity, useCustomFormContext } from 'modules/Builder/hooks';
import { InputController } from 'shared/components/FormComponents';
import { Tooltip } from 'shared/components/Tooltip';
import {
  MAX_LENGTH_OF_TEST,
  MAX_NUMBER_OF_TRIALS,
  MAX_SLOPE,
  MIN_LENGTH_OF_TEST,
  MIN_NUMBER_OF_TRIALS,
  MIN_SLOPE,
} from 'shared/consts';
import {
  StyledCheckboxTooltipSvg,
  StyledFlexTopCenter,
  StyledSmallNumberInput,
  StyledSmallPercentageInput,
  StyledTitleLarge,
  StyledTitleMedium,
  theme,
} from 'shared/styles';

export const GeneralSettings = () => {
  const { t } = useTranslation();
  const { control, watch, setValue } = useCustomFormContext();
  const { fieldName } = useCurrentActivity();

  const practiceName = `${fieldName}.items.2.config`;
  const testName = `${fieldName}.items.4.config`;
  const practiceTrialsNumberName = `${practiceName}.trialsNumber`;
  const practiceDurationMinutesName = `${practiceName}.durationMinutes`;
  const practiceLambdaSlopeName = `${practiceName}.lambdaSlope`;
  const testTrialsNumberName = `${testName}.trialsNumber`;
  const testDurationMinutesName = `${testName}.durationMinutes`;
  const testLambdaSlopeName = `${testName}.lambdaSlope`;
  const practiceTrialsNumber = watch(practiceTrialsNumberName);
  const practiceDurationMinutes = watch(practiceDurationMinutesName);
  const practiceLambdaSlope = watch(practiceLambdaSlopeName);
  const dataTestid = 'builder-activity-gyroscope-and-touch';

  useEffect(() => {
    setValue(testTrialsNumberName, practiceTrialsNumber);
  }, [practiceTrialsNumber]);
  useEffect(() => {
    setValue(testDurationMinutesName, practiceDurationMinutes);
  }, [practiceDurationMinutes]);
  useEffect(() => {
    setValue(testLambdaSlopeName, practiceLambdaSlope);
  }, [practiceLambdaSlope]);

  return (
    <StyledItemOptionContainer data-testid={dataTestid}>
      <StyledTitleLarge sx={{ mb: theme.spacing(2.4) }}>{t('generalSettings')}</StyledTitleLarge>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <StyledTitleMedium sx={{ position: 'relative' }}>
            {t('numberOfTrials')}
            <Tooltip tooltipTitle={t('numberOfTrialsTooltip')}>
              <span>
                <StyledCheckboxTooltipSvg id="more-info-outlined" />
              </span>
            </Tooltip>
          </StyledTitleMedium>
          <StyledSmallNumberInput>
            <InputController
              type="number"
              control={control}
              key={practiceTrialsNumberName}
              name={practiceTrialsNumberName}
              minNumberValue={MIN_NUMBER_OF_TRIALS}
              maxNumberValue={MAX_NUMBER_OF_TRIALS}
              data-testid={`${dataTestid}-number-of-trials`}
            />
          </StyledSmallNumberInput>
        </Grid>
        <Grid item xs={4}>
          <StyledTitleMedium>{t('lengthOfTest')}</StyledTitleMedium>
          <StyledFlexTopCenter>
            <StyledSmallNumberInput>
              <InputController
                type="number"
                control={control}
                key={practiceDurationMinutesName}
                name={practiceDurationMinutesName}
                minNumberValue={MIN_LENGTH_OF_TEST}
                maxNumberValue={MAX_LENGTH_OF_TEST}
                data-testid={`${dataTestid}-length-of-test`}
              />
            </StyledSmallNumberInput>
            <StyledTitleMedium sx={{ ml: theme.spacing(0.4) }}>{t('minutes')}</StyledTitleMedium>
          </StyledFlexTopCenter>
        </Grid>
        <Grid item xs={4}>
          <StyledTitleMedium sx={{ position: 'relative' }}>
            {t('lambdaSlope')}
            <Tooltip tooltipTitle={t('lambdaSlopeTooltip')}>
              <span>
                <StyledCheckboxTooltipSvg id="more-info-outlined" />
              </span>
            </Tooltip>
          </StyledTitleMedium>
          <StyledSmallPercentageInput>
            <InputController
              type="number"
              control={control}
              key={practiceLambdaSlopeName}
              name={practiceLambdaSlopeName}
              minNumberValue={MIN_SLOPE}
              maxNumberValue={MAX_SLOPE}
              textAdornment="%"
              data-testid={`${dataTestid}-lambda-scope`}
            />
          </StyledSmallPercentageInput>
        </Grid>
      </Grid>
    </StyledItemOptionContainer>
  );
};
