import { useTranslation } from 'react-i18next';

import { Svg } from 'components';
import { StyledIconBtn, StyledTextField } from 'components/DatePicker/DatePicker.styles';
import theme from 'styles/theme';
import { StyledFlexTopStart } from 'styles/styledComponents';

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
