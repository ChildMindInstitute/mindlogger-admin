import { Svg } from 'shared/components';
import theme from 'shared/styles/theme';
import { StyledLabelLarge, StyledFlexTopCenter } from 'shared/styles/styledComponents';

import { StyledHeader, StyledCloseBtn } from './Header.styles';
import { HeaderProps } from './Header.types';

export const Header = ({ onClickHandler, 'data-testid': dataTestid }: HeaderProps) => (
  <StyledHeader>
    <StyledFlexTopCenter>
      <Svg id="mind-logger-logo" />
      <StyledLabelLarge sx={{ marginLeft: theme.spacing(1) }}>MindLogger</StyledLabelLarge>
    </StyledFlexTopCenter>
    <StyledCloseBtn onClick={onClickHandler} data-testid={`${dataTestid}-remove`}>
      <Svg id="cross" />
    </StyledCloseBtn>
  </StyledHeader>
);
