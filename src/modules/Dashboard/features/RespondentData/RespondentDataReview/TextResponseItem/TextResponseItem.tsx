import { Box } from '@mui/material';

import { TextResponseItemProps } from './TextResponseItem.types';

export const TextResponseItem = ({ response }: TextResponseItemProps) => (
  <Box>{response.value}</Box>
);
