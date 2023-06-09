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
  MAX_THRESHOLD_DURATION,
  MIN_MILLISECONDS_DURATION,
  MIN_THRESHOLD_DURATION,
} from 'shared/consts';

import { IsPracticeRoundType, RoundTypeEnum } from '../RoundSettings.types';
import { getCheckboxes } from './RoundOptions.utils';

export const RoundOptions = ({ isPracticeRound }: IsPracticeRoundType) => {
  const { t } = useTranslation();
  const { control } = useFormContext();
  const { perfTaskItemField } = useCurrentActivity();
  const roundField = `${perfTaskItemField}.${
    isPracticeRound ? RoundTypeEnum.Practice : RoundTypeEnum.Test
  }`;

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
