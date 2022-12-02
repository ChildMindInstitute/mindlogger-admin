import { StyledCustomCover, StyledImage } from './AppletImage.styles';

export const AppletImage = ({
  image,
  appletName = '',
}: {
  image?: string;
  appletName?: string;
}) => (
  <StyledCustomCover>{image ? <StyledImage src={image} /> : appletName[0] || ''}</StyledCustomCover>
);
