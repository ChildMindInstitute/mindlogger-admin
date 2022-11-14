import { SVGProps } from 'react';
import { variables } from 'styles/variables';

export const Selected = ({
  width = 24,
  height = 24,
  color = variables.palette.shades100,
}: SVGProps<SVGElement>): JSX.Element => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.0251 16.4L6.02515 12.4L7.42515 11L10.0251 13.6L16.6251 7L18.0251 8.4L10.0251 16.4Z"
      fill={color || 'currentColor'}
    />
  </svg>
);
