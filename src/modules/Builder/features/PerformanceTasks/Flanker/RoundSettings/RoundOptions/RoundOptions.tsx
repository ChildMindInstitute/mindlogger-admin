import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import {
  StyledFlexColumn,
  StyledFlexTopCenter,
  StyledSmallNumberInput,
  StyledTitleMedium,
  theme,
} from 'shared/styles';
import { useCurrentActivity } from 'modules/Builder/hooks';
import { CheckboxController, InputController } from 'shared/components/FormComponents';
import {
  MIN_MILLISECONDS_DURATION,
  MAX_THRESHOLD_DURATION,
  MIN_THRESHOLD_DURATION,
} from 'shared/consts';

import { RoundType } from '../RoundSettings.types';
import { getCheckboxes } from './RoundOptions.utils';

export const RoundOptions = ({ isPracticeRound }: RoundType) => {
  const { t } = useTranslation();
  const { control } = useFormContext();
  const { fieldName } = useCurrentActivity();
  const roundField = `${fieldName}.${isPracticeRound ? 'practice' : 'test'}`;

  return (
    <>
      <StyledFlexTopCenter sx={{ mb: theme.spacing(1) }}>
        <StyledTitleMedium>{t('flankerRound.showStimulusFor')}</StyledTitleMedium>
        <StyledSmallNumberInput>
          <InputController
            control={control}
            name={`${roundField}.stimulusDuration`}
            type="number"
            minNumberValue={MIN_MILLISECONDS_DURATION}
          />
        </StyledSmallNumberInput>
        <StyledTitleMedium>{t('milliseconds')}</StyledTitleMedium>
      </StyledFlexTopCenter>
      {isPracticeRound && (
        <StyledFlexTopCenter sx={{ mb: theme.spacing(1) }}>
          <StyledTitleMedium>{t('flankerRound.threshold')}</StyledTitleMedium>
          <StyledSmallNumberInput>
            <InputController
              control={control}
              name={`${roundField}.threshold`}
              type="number"
              minNumberValue={MIN_THRESHOLD_DURATION}
              maxNumberValue={MAX_THRESHOLD_DURATION}
              textAdornment="%"
            />
          </StyledSmallNumberInput>
        </StyledFlexTopCenter>
      )}
      <StyledFlexColumn sx={{ mb: theme.spacing(2.4) }}>
        {getCheckboxes(roundField)?.map(({ name, label }) => (
          <CheckboxController key={name} control={control} name={name} label={label} />
        ))}
      </StyledFlexColumn>
    </>
  );
};
