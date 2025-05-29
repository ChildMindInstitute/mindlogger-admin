import { t } from 'i18next';

import curiousIcon from 'assets/images/curious_icon--black.png';
import { Svg } from 'shared/components/Svg';
import {
  StyledFlexTopCenter,
  StyledIcon,
  StyledIconButton,
  StyledIconWrapper,
  StyledLabelLarge,
} from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';

import { StyledHeader } from './Header.styles';
import { HeaderProps } from './Header.types';

export const Header = ({ onClickHandler, 'data-testid': dataTestid }: HeaderProps) => (
  <StyledHeader data-testid={`${dataTestid}-header`}>
    <StyledFlexTopCenter>
      <StyledIconWrapper>
        <StyledIcon src={curiousIcon} alt={t('logoAltText')} />
      </StyledIconWrapper>
      <StyledLabelLarge sx={{ marginLeft: theme.spacing(1) }}>Curious</StyledLabelLarge>
    </StyledFlexTopCenter>
    <StyledIconButton onClick={onClickHandler} data-testid={`${dataTestid}-remove`}>
      <Svg id="cross" />
    </StyledIconButton>
  </StyledHeader>
);
