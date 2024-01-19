import { Svg } from 'shared/components/Svg';
import { theme } from 'shared/styles';

import { StyledName, StyledNameWrapper } from './AudioPlayerHeader.styles';
import { AudioPlayerHeaderProps } from './AudioPlayerHeader.types';

export const AudioPlayerHeader = ({ open, media }: AudioPlayerHeaderProps) => {
  if (open || !media) return null;

  return (
    <StyledNameWrapper>
      {media && <Svg id="check" width={18} height={18} />}
      <StyledName sx={{ marginRight: theme.spacing(0.4) }}>{media?.name}</StyledName>
    </StyledNameWrapper>
  );
};
