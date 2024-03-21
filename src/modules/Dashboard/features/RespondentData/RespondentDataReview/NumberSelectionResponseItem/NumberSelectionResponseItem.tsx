import { Box } from '@mui/material';

import { NumberSelectionItemAnswer } from '../RespondentDataReview.types';

export const NumberSelectionResponseItem = ({
  answer,
  'data-testid': dataTestid,
}: NumberSelectionItemAnswer) => <Box data-testid={dataTestid}>{answer?.value ?? ''}</Box>;
