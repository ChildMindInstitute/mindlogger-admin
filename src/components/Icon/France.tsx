import { SVGProps } from 'react';

export const France = ({ width = 32, height = 24 }: SVGProps<SVGElement>): JSX.Element => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 33 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <mask id="mask0_1069_18755" maskUnits="userSpaceOnUse" x="0" y="0" width="33" height="24">
      <rect x="0.0251465" width="32" height="24" rx="4" fill="white" />
    </mask>
    <g mask="url(#mask0_1069_18755)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22.0251 0H32.0251V24H22.0251V0Z"
        fill="#F50100"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.0251465 0H12.0251V24H0.0251465V0Z"
        fill="#2E42A5"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.0251 0H22.0251V24H10.0251V0Z"
        fill="#F7FCFF"
      />
    </g>
  </svg>
);
