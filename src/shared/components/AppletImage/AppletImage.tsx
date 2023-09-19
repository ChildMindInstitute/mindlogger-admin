import { variables } from 'shared/styles';

import { StyledCustomCover, StyledImage } from './AppletImage.styles';
import { AppletImageProps } from './AppletImage.types';

export const AppletImage = ({
  image,
  appletName = '',
  width = '3.2rem',
  height = '3.2rem',
  borderRadius = variables.borderRadius.xxs,
  backgroundColor = variables.palette.primary_container,
}: AppletImageProps) => (
  <StyledCustomCover sx={{ width, height, borderRadius, backgroundColor }}>
    {image ? <StyledImage sx={{ borderRadius }} src={image} /> : appletName[0] || ''}
  </StyledCustomCover>
);
