import { Box } from '@mui/material';

import { theme, StyledHeadlineLarge } from 'shared/styles';

import { FlowResponsesProps } from './FlowResponses.types';
import { ActivityResponses } from '../ActivityResponses';
import { StyledWrapper } from './FlowResponses.styles';

export const FlowResponses = ({ flowAnswers, 'data-testid': dataTestid }: FlowResponsesProps) => (
  <Box sx={{ mt: theme.spacing(3) }}>
    {flowAnswers.map(({ activityName, answers, answerId }, index) => (
      <StyledWrapper key={answerId} data-testid={`${dataTestid}-${index}`}>
        <StyledHeadlineLarge sx={{ mb: theme.spacing(1) }}>{activityName}</StyledHeadlineLarge>
        <ActivityResponses activityAnswers={answers} data-testid={`${dataTestid}-items`} />
      </StyledWrapper>
    ))}
  </Box>
);
