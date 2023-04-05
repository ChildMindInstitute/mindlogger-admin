import { Box } from '@mui/material';

import { ResponseItemProps } from '../Review.types';

export const TextResponseItem = ({ response }: ResponseItemProps) => <Box>{response.value}</Box>;
