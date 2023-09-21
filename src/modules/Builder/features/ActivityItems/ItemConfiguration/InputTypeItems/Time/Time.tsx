import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components/Svg';
import { StyledIconBtn, StyledTextField } from 'shared/components/DatePicker/DatePicker.styles';
import { theme } from 'shared/styles/theme';
import { StyledFlexTopStart } from 'shared/styles/styledComponents';

import { TimeProps } from './Time.types';
import { ItemOptionContainer } from '../ItemOptionContainer';

export const Time = ({ isRange }: TimeProps) => {
  const { t } = useTranslation('app');

  return (
    <ItemOptionContainer
      title={t(isRange ? 'timeRangeTitle' : 'timeTitle')}
      description={t(isRange ? 'timeRangeDescription' : 'timeDescription')}
    >
      <StyledFlexTopStart>
        <StyledTextField
          disabled
          variant="outlined"
          label={t(isRange ? 'startTime' : 'time')}
          InputProps={{
            endAdornment: (
              <StyledIconBtn disabled>
                <Svg id="clock" />
              </StyledIconBtn>
            ),
          }}
          sx={{ mr: theme.spacing(2) }}
        />
        {isRange && (
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
        )}
      </StyledFlexTopStart>
    </ItemOptionContainer>
  );
};
