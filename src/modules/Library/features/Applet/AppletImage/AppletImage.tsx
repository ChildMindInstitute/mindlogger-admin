import { variables, StyledTitleLarge } from 'shared/styles';

import { StyledAppletImageContainer, StyledImage, StyledCustomCover } from './AppletImage.styles';
import { AppletImageProps } from './AppletImage.types';

export const AppletImage = ({ name, image }: AppletImageProps) => (
  <StyledAppletImageContainer>
    {image ? (
      <StyledImage src={image} alt={name} />
    ) : (
      <StyledCustomCover>
        <StyledTitleLarge color={variables.palette.secondary}>{name[0]}</StyledTitleLarge>
      </StyledCustomCover>
    )}
  </StyledAppletImageContainer>
);
