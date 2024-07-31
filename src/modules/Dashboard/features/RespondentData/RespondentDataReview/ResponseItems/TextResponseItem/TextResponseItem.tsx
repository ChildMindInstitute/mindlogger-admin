import { Box } from '@mui/material';

import { TextItemAnswer, ParagraphTextItemAnswer } from '../../RespondentDataReview.types';

export const TextResponseItem = ({
  answer,
  'data-testid': dataTestid,
}: TextItemAnswer | ParagraphTextItemAnswer) => <Box data-testid={dataTestid}>{answer}</Box>;
