import { styled } from '@mui/system';

import { StyledFlexAllCenter } from 'shared/styles';

import { StyledTextBtn } from '../RespondentData.styles';

export const StyledReviewContainer = styled(StyledFlexAllCenter)`
  width: 100%;
  height: 100%;
  position: relative;
`;

export const StyledFeedbackBtn = styled(StyledTextBtn)`
  position: absolute;
  top: 3rem;
  right: 8rem;
`;
