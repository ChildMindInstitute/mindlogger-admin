import { StyledFlexColumn, StyledLabelBoldLarge, StyledTitleMedium } from 'styles/styledComponents';
import theme from 'styles/theme';

import { StyledItemOptionContainer } from './ItemOptionContainer.styles';
import { ItemOptionContainerProps } from './ItemOptionContainer.types';

export const ItemOptionContainer = ({ title, description, children }: ItemOptionContainerProps) => (
  <StyledItemOptionContainer>
    <StyledFlexColumn>
      {title && (
        <StyledLabelBoldLarge sx={{ mb: theme.spacing(description ? 1 : 3.8) }}>
          {title}
        </StyledLabelBoldLarge>
      )}
      {description && (
        <StyledTitleMedium sx={{ mb: theme.spacing(1) }}>{description}</StyledTitleMedium>
      )}
      {children}
    </StyledFlexColumn>
  </StyledItemOptionContainer>
);
