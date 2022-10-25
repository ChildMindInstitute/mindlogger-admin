import { SVGProps } from 'react';

export const DropdownUp = ({
  width = 24,
  height = 24,
  color = '#000',
}: SVGProps<SVGElement>): JSX.Element => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17 15L12 10L7 15L17 15Z"
      fill={color || 'currentColor'}
      fillOpacity="0.87"
    />
  </svg>
);
