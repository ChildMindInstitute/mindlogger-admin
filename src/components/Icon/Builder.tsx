import { SVGProps } from 'react';

import { variables } from 'styles/variables';

export const Builder = ({
  width = 24,
  height = 24,
  color = variables.palette.on_surface_variant,
}: SVGProps<SVGElement>): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M17 11H20C21.11 11 22 10.1 22 9V5C22 3.89 21.1 3 20 3H17C15.89 3 15 3.9 15 5V6H9.01V5C9.01 3.89 8.11 3 7.01 3H4C2.9 3 2 3.9 2 5V9C2 10.11 2.9 11 4 11H7C8.11 11 9 10.1 9 9V8H11V15.01C11 16.66 12.34 18 13.99 18H15V19C15 20.11 15.9 21 17 21H20C21.11 21 22 20.1 22 19V15C22 13.89 21.1 13 20 13H17C15.89 13 15 13.9 15 15V16H13.99C13.45 16 13 15.55 13 15.01V8H15V9C15 10.1 15.9 11 17 11Z"
      fill={color}
    />
  </svg>
);
