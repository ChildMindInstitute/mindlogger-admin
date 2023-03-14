import { StyledCustomCover, StyledImage } from './AppletImage.styles';
import { AppletImageProps } from './AppletImage.types';

export const AppletImage = ({ image, appletName = '' }: AppletImageProps) => (
  <StyledCustomCover>{image ? <StyledImage src={image} /> : appletName[0] || ''}</StyledCustomCover>
);
