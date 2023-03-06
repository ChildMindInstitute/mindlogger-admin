import { StyledBuilderBtn, StyledHeadlineLarge } from 'styles/styledComponents';

import { StyledRow, StyledButtons } from './Header.styles';
import { HeaderProps } from './Header.types';

export const Header = ({ title, buttons }: HeaderProps) => (
  <StyledRow>
    <StyledHeadlineLarge>{title}</StyledHeadlineLarge>
    <StyledButtons>
      {buttons?.map(({ icon, label, handleClick }) => (
        <StyledBuilderBtn key={label} onClick={handleClick} startIcon={icon}>
          {label}
        </StyledBuilderBtn>
      ))}
    </StyledButtons>
  </StyledRow>
);
