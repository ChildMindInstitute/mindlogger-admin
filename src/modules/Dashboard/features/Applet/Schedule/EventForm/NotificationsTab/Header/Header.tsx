import { Svg } from 'shared/components/Svg';
import theme from 'shared/styles/theme';
import {
  StyledLabelLarge,
  StyledFlexTopCenter,
  StyledIconButton,
} from 'shared/styles/styledComponents';

import { StyledHeader } from './Header.styles';
import { HeaderProps } from './Header.types';

export const Header = ({ onClickHandler, 'data-testid': dataTestid }: HeaderProps) => (
  <StyledHeader data-testid={`${dataTestid}-header`}>
    <StyledFlexTopCenter>
      <Svg id="mind-logger-logo" />
      <StyledLabelLarge sx={{ marginLeft: theme.spacing(1) }}>MindLogger</StyledLabelLarge>
    </StyledFlexTopCenter>
    <StyledIconButton onClick={onClickHandler} data-testid={`${dataTestid}-remove`}>
      <Svg id="cross" />
    </StyledIconButton>
  </StyledHeader>
);
