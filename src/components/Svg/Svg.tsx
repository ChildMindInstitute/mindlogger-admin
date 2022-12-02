import { SVGProps } from 'react';
import { SvgProps } from './Svg.types';

export const Svg = ({
  id,
  width = 24,
  height = 24,
  ...otherProps
}: SvgProps & SVGProps<SVGSVGElement>) => (
  <svg className={`svg-${id}`} width={width} height={height} {...otherProps}>
    <use xlinkHref={`#svg-${id}`} />
  </svg>
);
