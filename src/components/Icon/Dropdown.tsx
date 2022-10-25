import { SVGProps } from 'react';

export const Dropdown = ({
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
      d="M7 10L12 15L17 10H7Z"
      fill={color || 'currentColor'}
      fillOpacity="0.87"
    />
  </svg>
);
