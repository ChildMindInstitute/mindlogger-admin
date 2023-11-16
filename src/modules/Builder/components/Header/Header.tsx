import { Button } from '@mui/material';

import { StyledHeadlineLarge } from 'shared/styles';

import { StyledRow, StyledButtons } from './Header.styles';
import { HeaderProps } from './Header.types';

export const Header = ({ title, buttons }: HeaderProps) => (
  <StyledRow>
    <StyledHeadlineLarge>{title}</StyledHeadlineLarge>
    <StyledButtons>
      {buttons?.map(({ icon, label, handleClick }) => (
        <Button variant="outlined" key={label} onClick={handleClick} startIcon={icon}>
          {label}
        </Button>
      ))}
    </StyledButtons>
  </StyledRow>
);
