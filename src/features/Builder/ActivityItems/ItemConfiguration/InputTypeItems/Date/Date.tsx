import { useTranslation } from 'react-i18next';

import { Svg } from 'components';
import { StyledIconBtn, StyledTextField } from 'components/DatePicker/DatePicker.styles';

import { ItemOptionContainer } from '../ItemOptionContainer';

export const Date = () => {
  const { t } = useTranslation('app');

  return (
    <ItemOptionContainer title={t('dateItemTitle')} description={t('dateItemDescription')}>
      <StyledTextField
        disabled
        variant="outlined"
        value={'DD MM YYYY'}
        sx={{ width: '35rem' }}
        InputProps={{
          endAdornment: (
            <StyledIconBtn disabled>
              <Svg id="date" />
            </StyledIconBtn>
          ),
        }}
      />
    </ItemOptionContainer>
  );
};
