import { SVGProps } from 'react';

export const Plus = ({
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
    <path d="M20 13H13V20H11V13H4V11H11V4H13V11H20V13Z" fill={color || 'currentColor'} />
  </svg>
);
