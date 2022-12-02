import { SvgProps } from './Svg.types';

export const Svg = ({ id, width = 24, height = 24, onMouseEnter }: SvgProps) => (
  <svg className={`svg-${id}`} width={width} height={height} onMouseEnter={onMouseEnter}>
    <use xlinkHref={`#svg-${id}`} />
  </svg>
);
