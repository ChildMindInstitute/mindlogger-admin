import { SVGProps } from 'react';

import { variables } from 'styles/variables';

export const Manager = ({
  width = 24,
  height = 24,
  color = variables.palette.shades80,
}: SVGProps<SVGElement>): JSX.Element => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 5C12.7956 5 13.5587 5.31607 14.1213 5.87868C14.6839 6.44129 15 7.20435 15 8C15 8.79565 14.6839 9.55871 14.1213 10.1213C13.5587 10.6839 12.7956 11 12 11C11.2044 11 10.4413 10.6839 9.87868 10.1213C9.31607 9.55871 9 8.79565 9 8C9 7.20435 9.31607 6.44129 9.87868 5.87868C10.4413 5.31607 11.2044 5 12 5ZM17.13 17C15.92 18.85 14.11 20.24 12 20.92C9.89 20.24 8.08 18.85 6.87 17C6.53 16.5 6.24 16 6 15.47C6 13.82 8.71 12.47 12 12.47C15.29 12.47 18 13.79 18 15.47C17.76 16 17.47 16.5 17.13 17Z"
      fill={color || 'currentColor'}
    />
  </svg>
);
