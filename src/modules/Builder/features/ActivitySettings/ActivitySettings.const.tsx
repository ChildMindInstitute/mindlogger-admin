import { ButtonPropsVariantOverrides } from '@mui/material';

import { Svg } from 'shared/components/Svg';

export const commonButtonProps = {
  variant: 'outlined' as keyof ButtonPropsVariantOverrides,
  startIcon: <Svg id="add" width="20" height="20" />,
};
