import { SVGProps } from 'react';

import { variables } from 'styles/variables';

export const Dashboard = ({
  width = 24,
  height = 24,
  color = variables.palette.shades95,
}: SVGProps<SVGElement>): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M5 11H9C10.1 11 11 10.1 11 9V5C11 3.9 10.1 3 9 3H5C3.9 3 3 3.9 3 5V9C3 10.1 3.9 11 5 11Z"
      fill={color}
    />
    <path
      d="M5 21H9C10.1 21 11 20.1 11 19V15C11 13.9 10.1 13 9 13H5C3.9 13 3 13.9 3 15V19C3 20.1 3.9 21 5 21Z"
      fill={color}
    />
    <path
      d="M13 5V9C13 10.1 13.9 11 15 11H19C20.1 11 21 10.1 21 9V5C21 3.9 20.1 3 19 3H15C13.9 3 13 3.9 13 5Z"
      fill={color}
    />
    <path
      d="M15 21H19C20.1 21 21 20.1 21 19V15C21 13.9 20.1 13 19 13H15C13.9 13 13 13.9 13 15V19C13 20.1 13.9 21 15 21Z"
      fill={color}
    />
  </svg>
);
