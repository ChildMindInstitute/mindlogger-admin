import { StyledBodyMedium, StyledFlexTopCenter, theme } from 'shared/styles';

import { StyledColorBox } from './ChartLegend.styles';
import { ChartLegendProps } from './ChartLegend.types';

export const ChartLegend = ({ legendData }: ChartLegendProps) => (
  <StyledFlexTopCenter sx={{ m: theme.spacing(2.6, 0), flexWrap: 'wrap' }}>
    {legendData.map(({ text, fillStyle }) => (
      <StyledFlexTopCenter key={fillStyle || text} sx={{ mr: theme.spacing(2.4) }}>
        <StyledColorBox bgColor={fillStyle as string} />
        <StyledBodyMedium>{text}</StyledBodyMedium>
      </StyledFlexTopCenter>
    ))}
  </StyledFlexTopCenter>
);
