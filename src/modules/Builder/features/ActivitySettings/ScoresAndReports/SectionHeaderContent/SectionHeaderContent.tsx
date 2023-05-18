import { StyledClearedButton, theme } from 'shared/styles';
import { Svg } from 'shared/components';

import { SubscaleHeaderContentProps } from './SectionHeaderContent.types';
import { StyledWrapper } from './SectionHeaderContent.styles';
import { TitleComponent } from '../../TitleComponent';

export const SectionHeaderContent = ({
  onRemove,
  name,
  title,
  open,
}: SubscaleHeaderContentProps) => (
  <StyledWrapper>
    <TitleComponent title={title} name={name} open={open} />
    <StyledClearedButton sx={{ p: theme.spacing(1), mr: theme.spacing(0.2) }} onClick={onRemove}>
      <Svg id="trash" width="20" height="20" />
    </StyledClearedButton>
  </StyledWrapper>
);
