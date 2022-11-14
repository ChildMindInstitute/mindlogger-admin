import type { SVGProps } from 'react';

import { variables } from 'styles/variables';

export const MoreHorizontal = ({
  width = 24,
  height = 24,
  color = variables.palette.shades100,
}: SVGProps<SVGElement>): JSX.Element => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_783_27476)">
      <path
        d="M8 12C8 10.9 7.1 10 6 10C4.9 10 4 10.9 4 12C4 13.1 4.9 14 6 14C7.1 14 8 13.1 8 12ZM10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10C10.9 10 10 10.9 10 12ZM16 12C16 13.1 16.9 14 18 14C19.1 14 20 13.1 20 12C20 10.9 19.1 10 18 10C16.9 10 16 10.9 16 12Z"
        fill={color || 'currentColor'}
      />
    </g>
    <defs>
      <clipPath id="clip0_783_27476">
        <rect width={width} height={height} fill="white" />
      </clipPath>
    </defs>
  </svg>
);
