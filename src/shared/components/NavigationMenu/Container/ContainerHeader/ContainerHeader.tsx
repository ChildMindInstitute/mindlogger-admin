import { Svg } from 'shared/components/Svg';
import { StyledBuilderContainerHeader } from 'shared/features/BuilderContainer';
import { StyledClearedButton, theme } from 'shared/styles';

import { ContainerHeaderProps } from './ContainerHeader.types';

export const ContainerHeader = ({ isSticky, headerProps, children }: ContainerHeaderProps) => (
  <StyledBuilderContainerHeader isSticky={isSticky}>
    {children}
    <StyledClearedButton sx={{ p: theme.spacing(1) }} onClick={headerProps?.onClose}>
      <Svg id="close" />
    </StyledClearedButton>
  </StyledBuilderContainerHeader>
);
