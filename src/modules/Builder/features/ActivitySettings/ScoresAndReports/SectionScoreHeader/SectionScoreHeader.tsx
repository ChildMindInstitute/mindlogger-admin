import { StyledClearedButton, theme } from 'shared/styles';
import { Svg } from 'shared/components';

import { SectionScoreHeaderProps } from './SectionScoreHeader.types';
import { StyledWrapper } from './SectionScoreHeader.styles';
import { TitleComponent } from '../../TitleComponent';

export const SectionScoreHeader = ({ onRemove, name, title, open }: SectionScoreHeaderProps) => (
  <StyledWrapper>
    <TitleComponent title={title} name={name} open={open} />
    <StyledClearedButton sx={{ p: theme.spacing(1), mr: theme.spacing(0.2) }} onClick={onRemove}>
      <Svg id="trash" width="20" height="20" />
    </StyledClearedButton>
  </StyledWrapper>
);
