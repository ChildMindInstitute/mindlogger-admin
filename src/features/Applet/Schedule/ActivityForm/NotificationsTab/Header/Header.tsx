import { Svg } from 'components';
import theme from 'styles/theme';
import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';
import { StyledLabelLarge } from 'styles/styledComponents/Typography';
import { StyledClearedButton } from 'styles/styledComponents/ClearedButton';

import { StyledHeader } from './Header.styles';

export const Header = ({ onClickHandler }: { onClickHandler: () => void }) => (
  <StyledHeader>
    <StyledFlexTopCenter>
      <Svg id="mind-logger-logo" />
      <StyledLabelLarge sx={{ marginLeft: theme.spacing(1) }}>MindLogger</StyledLabelLarge>
    </StyledFlexTopCenter>
    <StyledClearedButton onClick={onClickHandler}>
      <Svg id="cross" />
    </StyledClearedButton>
  </StyledHeader>
);
