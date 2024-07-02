import { Svg } from 'shared/components/Svg';
import { StyledBodyLarge } from 'shared/styles';
import { palette } from 'shared/styles/variables/palette';

import { NavigationEyebrowProps } from './NavigationEyebrow.types';
import { StyledButton } from './NavigationEyebrow.styles';

export const NavigationEyebrow = ({ title, subtitle, onClick }: NavigationEyebrowProps) => (
  <StyledButton onClick={onClick}>
    <Svg id="arrow-navigate-left" />
    <StyledBodyLarge sx={{ color: palette.on_surface_variant }}>{title}</StyledBodyLarge>
    {subtitle && <StyledBodyLarge sx={{ color: palette.outline }}>{subtitle}</StyledBodyLarge>}
  </StyledButton>
);
