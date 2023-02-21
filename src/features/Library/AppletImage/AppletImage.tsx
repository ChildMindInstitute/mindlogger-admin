import { StyledTitleLarge } from 'styles/styledComponents';
import { variables } from 'styles/variables';

import { StyledCustomCover, StyledImage } from './AppletImage.styles';
import { AppletImageProps } from './AppletImage.types';

export const AppletImage = ({ name, image }: AppletImageProps) => (
  <StyledCustomCover>
    {image ? (
      <StyledImage src={image} />
    ) : (
      <StyledTitleLarge color={variables.palette.secondary}>{name[0]}</StyledTitleLarge>
    )}
  </StyledCustomCover>
);
