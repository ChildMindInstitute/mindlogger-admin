import styled from '@emotion/styled';

import { StyledFlexTopCenter, theme, variables } from 'shared/styles';

export const StyledWarningMessageContainer = styled(StyledFlexTopCenter)`
  gap: 1.6rem;
  background-color: ${variables.palette.yellow_light};
  padding: ${theme.spacing(0.8, 1.6)};
  margin-top: -1.6rem;
  border-bottom-left-radius: ${variables.borderRadius.sm};
  border-bottom-right-radius: ${variables.borderRadius.sm};
`;
