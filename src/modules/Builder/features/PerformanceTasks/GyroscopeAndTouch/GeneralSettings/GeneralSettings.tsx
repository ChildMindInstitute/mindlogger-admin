import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { Grid } from '@mui/material';

import { StyledItemOptionContainer } from 'modules/Builder/components';
import {
  StyledCheckboxTooltipSvg,
  StyledFlexTopCenter,
  StyledSmallNumberInput,
  StyledTitleLarge,
  StyledTitleMedium,
  theme,
} from 'shared/styles';
import { useCurrentActivity } from 'modules/Builder/hooks';
import { InputController } from 'shared/components/FormComponents';
import { Tooltip } from 'shared/components';
import {
  MAX_LENGTH_OF_TEST,
  MAX_NUMBER_OF_TRIALS,
  MIN_LENGTH_OF_TEST,
  MIN_NUMBER_OF_TRIALS,
  MIN_SLOPE,
  MAX_SLOPE,
} from 'shared/consts';

export const GeneralSettings = () => {
  const { t } = useTranslation();
  const { control } = useFormContext();
  const { perfTaskItemField } = useCurrentActivity();
  const generalName = `${perfTaskItemField}.general`;

  return (
    <StyledItemOptionContainer>
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
              name={`${generalName}.numberOfTrials`}
              minNumberValue={MIN_NUMBER_OF_TRIALS}
              maxNumberValue={MAX_NUMBER_OF_TRIALS}
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
                name={`${generalName}.lengthOfTest`}
                minNumberValue={MIN_LENGTH_OF_TEST}
                maxNumberValue={MAX_LENGTH_OF_TEST}
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
          <StyledSmallNumberInput>
            <InputController
              type="number"
              control={control}
              name={`${generalName}.lambdaSlope`}
              minNumberValue={MIN_SLOPE}
              maxNumberValue={MAX_SLOPE}
              textAdornment="%"
            />
          </StyledSmallNumberInput>
        </Grid>
      </Grid>
    </StyledItemOptionContainer>
  );
};
