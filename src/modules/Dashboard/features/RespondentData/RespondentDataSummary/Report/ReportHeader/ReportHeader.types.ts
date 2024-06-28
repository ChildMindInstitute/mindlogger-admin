import { MutableRefObject } from 'react';

import { ActivityOrFlow } from 'modules/Dashboard/features/RespondentData/RespondentData.types';

export type ReportHeaderProps = {
  containerRef: MutableRefObject<HTMLElement | null>;
  selectedEntity: ActivityOrFlow | null;
  'data-testid'?: string;
};
