import { Box } from '@mui/material';

import { TextItemAnswer } from '../../RespondentDataReview.types';

export const TextResponseItem = ({ answer, 'data-testid': dataTestid }: TextItemAnswer) => (
  <Box data-testid={dataTestid}>{answer}</Box>
);
