import {
  StyledFlexTopCenter,
  StyledLabelBoldLarge,
  StyledBodyLarge,
  theme,
  variables,
} from 'shared/styles';

import { TitleProps } from './Title.types';

export const Title = ({ title, name }: TitleProps) => (
  <StyledFlexTopCenter sx={{ alignItems: 'baseline' }}>
    <StyledLabelBoldLarge>{title}</StyledLabelBoldLarge>
    <StyledBodyLarge color={variables.palette.on_surface_variant} sx={{ ml: theme.spacing(1.2) }}>
      {name ?? ''}
    </StyledBodyLarge>
  </StyledFlexTopCenter>
);
