import { Box } from '@mui/material';
import { useState } from 'react';

import { Svg } from 'shared/components';
import { StyledFlexTopStart, StyledTitleBoldMedium } from 'shared/styles';

import { Reviewer } from '../FeedbackReviewed.types';
import { StyledButton, StyledReviewer } from './FeedbackReviewer.styles';

export const FeedbackReviewer = ({ reviewer }: { reviewer: Reviewer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleIsOpen = () => {
    setIsOpen((state) => !state);
  };

  return (
    <StyledReviewer>
      <StyledFlexTopStart sx={{ justifyContent: 'space-between' }}>
        <StyledTitleBoldMedium>{reviewer.fullName}</StyledTitleBoldMedium>
        <StyledButton onClick={toggleIsOpen}>
          <Svg id={isOpen ? 'navigate-up' : 'navigate-down'} />
        </StyledButton>
      </StyledFlexTopStart>
      {isOpen && <Box>some text</Box>}
    </StyledReviewer>
  );
};
