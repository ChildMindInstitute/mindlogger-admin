import { SvgProps } from './Svg.types';

export const Svg = ({ id, width = 24, height = 24, className }: SvgProps) => (
  <svg className={`svg-${id} ${className || ''}`} width={width} height={height}>
    <use xlinkHref={`#svg-${id}`} />
  </svg>
);
