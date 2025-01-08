import { SvgProps } from './Svg.types';

export const Svg = ({ id, width = 24, height = 24, className, ...rest }: SvgProps) => (
  <svg className={`svg-${id} ${className}`} width={width} height={height} {...rest}>
    <use xlinkHref={`#svg-${id}`} />
  </svg>
);
