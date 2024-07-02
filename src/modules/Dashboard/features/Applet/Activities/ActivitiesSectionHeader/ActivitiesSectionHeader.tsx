import { Box } from '@mui/material';

import { variables } from 'shared/styles';

import { ActivitiesSectionHeaderProps } from './ActivitiesSectionHeader.types';

export const ActivitiesSectionHeader = ({
  title,
  count = 0,
  ...otherProps
}: ActivitiesSectionHeaderProps) => (
  <Box
    component="header"
    sx={{ display: 'flex', gap: 0.8, fontSize: variables.font.size.xl }}
    {...otherProps}
  >
    {title}

    <Box component="span" sx={{ color: variables.palette.outline }}>
      •
    </Box>

    {count}
  </Box>
);
