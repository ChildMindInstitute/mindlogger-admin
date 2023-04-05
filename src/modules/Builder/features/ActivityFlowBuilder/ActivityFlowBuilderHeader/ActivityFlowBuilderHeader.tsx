import { StyledBuilderBtn } from 'shared/styles';
import { StyledHeader, BuilderContainerProps } from 'shared/features';

import { StyledButtons } from './ActivityFlowBuilderHeader.styles';
import { getButtons } from './ActivityFlowBuilderHeader.utils';

export const ActivityFlowBuilderHeader: BuilderContainerProps['Header'] = ({
  isSticky,
  children,
}) => (
  <StyledHeader isSticky={isSticky}>
    {children}
    <StyledButtons>
      {getButtons().map(({ label, icon }) => (
        <StyledBuilderBtn key={label} startIcon={icon}>
          {label}
        </StyledBuilderBtn>
      ))}
    </StyledButtons>
  </StyledHeader>
);
