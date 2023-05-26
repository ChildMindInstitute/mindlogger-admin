import { Box } from '@mui/material';

import { TextItemAnswer } from '../RespondentDataReview.types';
import { getTextResponse } from './TextResponseItem.utils';

export const TextResponseItem = ({ answer }: TextItemAnswer) => (
  <Box>{getTextResponse(answer)}</Box>
);
