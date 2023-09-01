import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { Checkbox, FormControlLabel } from '@mui/material';

import {
  StyledBodyMedium,
  StyledFlexColumn,
  StyledFlexTopCenter,
  StyledSmallNumberInput,
  StyledTitleMedium,
  theme,
} from 'shared/styles';
import { useCurrentActivity } from 'modules/Builder/hooks';
import { CheckboxController, InputController } from 'shared/components/FormComponents';
import {
  MAX_THRESHOLD_DURATION,
  MIN_MILLISECONDS_DURATION,
  MIN_THRESHOLD_DURATION,
} from 'shared/consts';
import { FlankerItemPositions, FlankerSamplingMethod } from 'modules/Builder/types';

import { IsPracticeRoundType } from '../RoundSettings.types';
import { getCheckboxes } from './RoundOptions.utils';

export const RoundOptions = ({ isPracticeRound }: IsPracticeRoundType) => {
  const { t } = useTranslation();
  const { control, setValue, watch } = useFormContext();
  const { fieldName } = useCurrentActivity();
  const roundField = `${fieldName}.items.${
    isPracticeRound ? FlankerItemPositions.PracticeFirst : FlankerItemPositions.TestFirst
  }.config`;
  const samplingMethodField = `${roundField}.samplingMethod`;
  const samplingMethod = watch(samplingMethodField);

  const handleSamplingMethodChange = (event: ChangeEvent<HTMLInputElement>) =>
    setValue(
      samplingMethodField,
      event.target.checked ? FlankerSamplingMethod.Randomize : FlankerSamplingMethod.Fixed,
    );

  return (
    <>
      <StyledFlexTopCenter>
        <StyledTitleMedium sx={{ mr: theme.spacing(0.5) }}>
          {t('flankerRound.showStimulusFor')}
        </StyledTitleMedium>
        <StyledSmallNumberInput>
          <InputController
            control={control}
            key={`${roundField}.trialDuration`}
            name={`${roundField}.trialDuration`}
            type="number"
            minNumberValue={MIN_MILLISECONDS_DURATION}
          />
        </StyledSmallNumberInput>
        <StyledTitleMedium sx={{ ml: theme.spacing(0.5) }}>{t('milliseconds')}</StyledTitleMedium>
      </StyledFlexTopCenter>
      {isPracticeRound && (
        <StyledFlexTopCenter>
          <StyledTitleMedium sx={{ mr: theme.spacing(0.5) }}>
            {t('flankerRound.threshold')}
          </StyledTitleMedium>
          <StyledSmallNumberInput>
            <InputController
              control={control}
              key={`${roundField}.minimumAccuracy`}
              name={`${roundField}.minimumAccuracy`}
              type="number"
              minNumberValue={MIN_THRESHOLD_DURATION}
              maxNumberValue={MAX_THRESHOLD_DURATION}
              textAdornment="%"
            />
          </StyledSmallNumberInput>
        </StyledFlexTopCenter>
      )}
      <StyledFlexColumn sx={{ mb: theme.spacing(2.4) }}>
        <FormControlLabel
          label={<StyledBodyMedium>{t('flankerRound.randomize')}</StyledBodyMedium>}
          control={
            <Checkbox
              checked={samplingMethod === FlankerSamplingMethod.Randomize}
              onChange={handleSamplingMethodChange}
            />
          }
        />
        {getCheckboxes(roundField)?.map(({ name, label }) => (
          <CheckboxController key={name} control={control} name={name} label={label} />
        ))}
      </StyledFlexColumn>
    </>
  );
};
