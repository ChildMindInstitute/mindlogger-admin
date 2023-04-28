import { Box } from '@mui/material';

import { TextItemAnswer } from '../RespondentDataReview.types';

export const TextResponseItem = ({ answer }: TextItemAnswer) => <Box>{answer.value || ''}</Box>;
