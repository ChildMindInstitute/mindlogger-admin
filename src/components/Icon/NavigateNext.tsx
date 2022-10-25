import type { SVGProps } from 'react';

export const NavigateNext = ({
  width = 24,
  height = 24,
  color = '#1f1f1f',
}: SVGProps<SVGElement>): JSX.Element => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.705 6L8.295 7.41L12.875 12L8.295 16.59L9.705 18L15.705 12L9.705 6Z"
      fill={color || 'currentColor'}
    />
  </svg>
);
