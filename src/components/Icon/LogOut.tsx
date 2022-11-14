import { SVGProps } from 'react';

import { variables } from 'styles/variables';

export const LogOut = ({
  width = 24,
  height = 24,
  color = variables.palette.shades80,
}: SVGProps<SVGElement>): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z"
      fill={color}
    />
  </svg>
);
