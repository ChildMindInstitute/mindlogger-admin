import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components/Svg';
import { theme, variables, StyledLabelBoldLarge, StyledClearedButton, StyledTitleMedium } from 'shared/styles';

import {
  StyledResponseDataIdentifierContainer,
  StyledResponseDataIdentifierHeader,
} from './ResponseDataIdentifier.styles';
import { ResponseDataIdentifierProps } from './ResponseDataIdentifier.types';

export const ResponseDataIdentifier = ({ onRemove }: ResponseDataIdentifierProps) => {
  const { t } = useTranslation('app');

  return (
    <StyledResponseDataIdentifierContainer>
      <StyledResponseDataIdentifierHeader>
        <StyledLabelBoldLarge>{t('responseDataIdentifier')}</StyledLabelBoldLarge>
        <StyledClearedButton
          sx={{ p: theme.spacing(1) }}
          onClick={onRemove}
          data-testid="builder-activity-items-item-configuration-data-indentifier-remove"
        >
          <Svg id="trash" width="20" height="20" />
        </StyledClearedButton>
      </StyledResponseDataIdentifierHeader>
      <StyledTitleMedium sx={{ color: variables.palette.on_surface }}>
        {t('responseDataIdentifierDescription')}
      </StyledTitleMedium>
    </StyledResponseDataIdentifierContainer>
  );
};
