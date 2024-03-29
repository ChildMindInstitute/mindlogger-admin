import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components/Svg';
import { StyledIconBtn, StyledTextField } from 'shared/components/DatePicker/DatePicker.styles';
import { theme } from 'shared/styles/theme';
import { StyledFlexTopStart } from 'shared/styles/styledComponents';
import { concatIf } from 'shared/utils';

import { TimeProps } from './Time.types';
import { ItemOptionContainer } from '../ItemOptionContainer';

export const Time = ({ isRange = false }: TimeProps) => {
  const { t } = useTranslation('app');

  const dataTestid = concatIf('builder-activity-items-item-configuration-time', '-range', isRange);

  return (
    <ItemOptionContainer
      title={t(isRange ? 'timeRangeTitle' : 'timeTitle')}
      description={t(isRange ? 'timeRangeDescription' : 'timeDescription')}
      data-testid={dataTestid}
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
          data-testid={concatIf(`${dataTestid}-input`, '-start', isRange)}
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
            data-testid={concatIf(`${dataTestid}-input`, '-end', isRange)}
          />
        )}
      </StyledFlexTopStart>
    </ItemOptionContainer>
  );
};
