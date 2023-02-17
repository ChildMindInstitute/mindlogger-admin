import { StyledHeadlineLarge } from 'styles/styledComponents';

import { StyledBtn, StyledRow, StyledButtons } from './BuilderHeader.styles';
import { BuilderHeaderProps } from './BuilderHeader.types';

export const BuilderHeader = ({ title, buttons }: BuilderHeaderProps) => (
  <StyledRow>
    <StyledHeadlineLarge>{title}</StyledHeadlineLarge>
    <StyledButtons>
      {buttons?.map(({ icon, label, handleClick }) => (
        <StyledBtn key={label} onClick={handleClick}>
          {icon}
          {label}
        </StyledBtn>
      ))}
    </StyledButtons>
  </StyledRow>
);
