import { SVGProps } from 'react';

import { variables } from 'styles/variables';

export const Library = ({
  width = 24,
  height = 24,
  color = variables.palette.on_surface_variant,
}: SVGProps<SVGElement>): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.7236 20C11.8236 20 12.7236 19.1 12.7236 18V6C12.7236 4.9 11.8236 4 10.7236 4C9.62363 4 8.72363 4.9 8.72363 6V18C8.72363 19.1 9.62363 20 10.7236 20ZM19.7942 19.7274C20.8567 19.4427 21.4931 18.3404 21.2084 17.2779L18.1026 5.68681C17.8179 4.62429 16.7156 3.98789 15.6531 4.27259C14.5906 4.55729 13.9542 5.65956 14.2389 6.72208L17.3447 18.3132C17.6294 19.3757 18.7317 20.0121 19.7942 19.7274ZM4.72363 20C5.82363 20 6.72363 19.1 6.72363 18V6.00552C6.72363 4.90552 5.82363 4.00552 4.72363 4.00552C3.62363 4.00552 2.72363 4.90552 2.72363 6.00552V18C2.72363 19.1 3.62363 20 4.72363 20Z"
      fill={color}
    />
  </svg>
);
