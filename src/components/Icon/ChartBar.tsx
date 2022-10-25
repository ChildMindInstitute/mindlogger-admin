import { SVGProps } from 'react';

export const ChartBar = ({
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
    <path d="M22 21H2V3H4V19H6V10H10V19H12V6H16V19H18V14H22V21Z" fill={color || 'currentColor'} />
  </svg>
);
