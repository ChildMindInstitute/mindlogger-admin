import { StyledTitleLarge } from 'styles/styledComponents';
import { variables } from 'styles/variables';

import { StyledAppletImageContainer, StyledImage, StyledCustomCover } from './AppletImage.styles';
import { AppletImageProps } from './AppletImage.types';

export const AppletImage = ({ name, image }: AppletImageProps) => (
  <StyledAppletImageContainer>
    {image ? (
      <StyledImage src={image} />
    ) : (
      <StyledCustomCover>
        <StyledTitleLarge color={variables.palette.secondary}>{name[0]}</StyledTitleLarge>
      </StyledCustomCover>
    )}
  </StyledAppletImageContainer>
);
