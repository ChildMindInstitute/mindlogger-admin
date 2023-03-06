import { StyledBuilderBtn, StyledHeadlineLarge } from 'styles/styledComponents';

import { StyledRow, StyledButtons } from './BuilderHeader.styles';
import { BuilderHeaderProps } from './BuilderHeader.types';

export const BuilderHeader = ({ title, buttons }: BuilderHeaderProps) => (
  <StyledRow>
    <StyledHeadlineLarge>{title}</StyledHeadlineLarge>
    <StyledButtons>
      {buttons?.map(({ icon, label, handleClick }) => (
        <StyledBuilderBtn key={label} onClick={handleClick}>
          {icon}
          {label}
        </StyledBuilderBtn>
      ))}
    </StyledButtons>
  </StyledRow>
);
