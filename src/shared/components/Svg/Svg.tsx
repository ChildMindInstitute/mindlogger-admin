import { SvgProps } from './Svg.types';

export const Svg = ({ id, width = 24, height = 24, className, 'data-testid': dataTestid }: SvgProps) => (
  <svg className={`svg-${id} ${className || ''}`} width={width} height={height} data-testid={dataTestid}>
    <use xlinkHref={`#svg-${id}`} />
  </svg>
);
