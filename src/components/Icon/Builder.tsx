import { SVGProps } from 'react';

export const Builder = ({
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
    <g clipPath="url(#clip0_88_4007)">
      <path d="M3 11H11V3H3V11ZM5 5H9V9H5V5Z" fill={color || 'currentColor'} />
      <path d="M13 3V11H21V3H13ZM19 9H15V5H19V9Z" fill={color || 'currentColor'} />
      <path d="M3 21H11V13H3V21ZM5 15H9V19H5V15Z" fill={color || 'currentColor'} />
      <path d="M18 13H16V16H13V18H16V21H18V18H21V16H18V13Z" fill={color || 'currentColor'} />
    </g>
    <defs>
      <clipPath id="clip0_88_4007">
        <rect width={width} height={height} fill="white" />
      </clipPath>
    </defs>
  </svg>
);
