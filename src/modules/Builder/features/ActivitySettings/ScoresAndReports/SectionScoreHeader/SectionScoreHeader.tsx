import { StyledClearedButton, StyledFlexTopCenter, theme } from 'shared/styles';
import { Svg } from 'shared/components/Svg';

import { SectionScoreHeaderProps } from './SectionScoreHeader.types';
import { StyledWrapper } from './SectionScoreHeader.styles';
import { TitleComponent } from '../../TitleComponent';

export const SectionScoreHeader = ({
  onRemove,
  name,
  title,
  open,
  dragHandleProps,
  'data-testid': dataTestid,
}: SectionScoreHeaderProps) => (
  <StyledWrapper>
    <TitleComponent title={title} name={name} open={open} data-testid={dataTestid} />
    <StyledFlexTopCenter>
      <StyledClearedButton
        sx={{ p: theme.spacing(1), mr: theme.spacing(0.2) }}
        onClick={onRemove}
        data-testid={`${dataTestid}-remove`}
      >
        <Svg id="trash" width="20" height="20" />
      </StyledClearedButton>
      {dragHandleProps && (
        <StyledClearedButton
          sx={{ p: theme.spacing(1), mr: theme.spacing(0.2) }}
          {...dragHandleProps}
          data-testid={`${dataTestid}-dnd`}
        >
          <Svg id="drag" />
        </StyledClearedButton>
      )}
    </StyledFlexTopCenter>
  </StyledWrapper>
);
