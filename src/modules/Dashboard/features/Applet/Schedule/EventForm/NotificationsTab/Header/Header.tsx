import { Svg } from 'shared/components';
import theme from 'shared/styles/theme';
import { StyledLabelLarge, StyledFlexTopCenter } from 'shared/styles/styledComponents';

import { StyledHeader, StyledCloseBtn } from './Header.styles';

export const Header = ({ onClickHandler }: { onClickHandler: () => void }) => (
  <StyledHeader>
    <StyledFlexTopCenter>
      <Svg id="mind-logger-logo" />
      <StyledLabelLarge sx={{ marginLeft: theme.spacing(1) }}>MindLogger</StyledLabelLarge>
    </StyledFlexTopCenter>
    <StyledCloseBtn onClick={onClickHandler}>
      <Svg id="cross" />
    </StyledCloseBtn>
  </StyledHeader>
);
