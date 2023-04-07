import { styled } from '@mui/material';

import { StyledFlexAllCenter } from 'shared/styles';

import { StyledTextBtn } from '../RespondentData.styles';

export const StyledReviewContainer = styled(StyledFlexAllCenter)`
  width: 100%;
  height: 100%;
  position: relative;
  overflow-y: auto;
`;

export const StyledFeedbackBtn = styled(StyledTextBtn)`
  position: absolute;
  top: 2rem;
  right: 8rem;
`;
