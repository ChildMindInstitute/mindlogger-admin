import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import { StyledIconBtn, StyledTextField } from 'shared/components/DatePicker/DatePicker.styles';
import { theme } from 'shared/styles/theme';
import { StyledFlexTopStart } from 'shared/styles/styledComponents';

import { ItemOptionContainer } from '../ItemOptionContainer';

export const TimeRange = () => {
  const { t } = useTranslation('app');

  return (
    <ItemOptionContainer title={t('timeRangeTitle')}>
      <StyledFlexTopStart>
        <StyledTextField
          disabled
          variant="outlined"
          label={t('startTime')}
          InputProps={{
            endAdornment: (
              <StyledIconBtn disabled>
                <Svg id="clock" />
              </StyledIconBtn>
            ),
          }}
          sx={{ mr: theme.spacing(2) }}
        />
        <StyledTextField
          disabled
          variant="outlined"
          label={t('endTime')}
          InputProps={{
            endAdornment: (
              <StyledIconBtn disabled>
                <Svg id="clock" />
              </StyledIconBtn>
            ),
          }}
        />
      </StyledFlexTopStart>
    </ItemOptionContainer>
  );
};
