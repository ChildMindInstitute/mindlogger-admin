import React from 'react';

import { StyledSelectController } from './ItemFlowSelectController.styles';

export type ItemFlowSelectControllerProps = {
  tooltipTitle?: string;
} & React.ComponentProps<typeof StyledSelectController>;
