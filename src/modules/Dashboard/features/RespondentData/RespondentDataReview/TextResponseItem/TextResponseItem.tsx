import { Box } from '@mui/material';

import { ItemAnswer, TextItemAnswer } from '../RespondentDataReview.types';

export const TextResponseItem = ({ answer }: TextItemAnswer) => (
  <Box>{(answer as ItemAnswer | null)?.value || ''}</Box>
);
