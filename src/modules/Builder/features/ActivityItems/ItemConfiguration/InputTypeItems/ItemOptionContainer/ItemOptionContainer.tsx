import { StyledItemOptionContainer } from 'modules/Builder/components/ToggleItemContainer';
import { theme, variables, StyledFlexColumn, StyledLabelBoldLarge, StyledTitleMedium } from 'shared/styles';

import { ItemOptionContainerProps } from './ItemOptionContainer.types';

export const ItemOptionContainer = ({
  title,
  description,
  children,
  'data-testid': dataTestid,
}: ItemOptionContainerProps) => (
  <StyledItemOptionContainer data-testid={dataTestid}>
    <StyledFlexColumn data-testid={`${dataTestid}-title`}>
      {title && <StyledLabelBoldLarge sx={{ mb: theme.spacing(description ? 1 : 3.8) }}>{title}</StyledLabelBoldLarge>}
      {description && (
        <StyledTitleMedium
          color={variables.palette.on_surface}
          sx={{ mb: theme.spacing(1) }}
          data-testid={`${dataTestid}-description`}
        >
          {description}
        </StyledTitleMedium>
      )}
      {children}
    </StyledFlexColumn>
  </StyledItemOptionContainer>
);
