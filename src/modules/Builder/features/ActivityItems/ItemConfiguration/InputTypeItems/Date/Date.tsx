import { useTranslation } from 'react-i18next';

import { StyledIconBtn, StyledTextField } from 'shared/components/DatePicker/DatePicker.styles';
import { Svg } from 'shared/components/Svg';

import { ItemOptionContainer } from '../ItemOptionContainer';

export const Date = () => {
  const { t } = useTranslation('app');

  const dataTestid = 'builder-activity-items-item-configuration-date';

  return (
    <ItemOptionContainer title={t('dateItemTitle')} description={t('dateItemDescription')} data-testid={dataTestid}>
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
        data-testid={`${dataTestid}-input`}
      />
    </ItemOptionContainer>
  );
};
