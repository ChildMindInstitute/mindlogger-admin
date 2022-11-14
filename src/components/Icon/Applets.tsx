import { SVGProps } from 'react';

import { variables } from 'styles/variables';

export const Applets = ({
  width = 24,
  height = 24,
  color = variables.palette.shades80,
}: SVGProps<SVGElement>): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M12.34 13.655V21.655H20.34V13.655H12.34ZM2.34 21.655H10.34V13.655H2.34V21.655ZM2.34 3.65497V11.655H10.34V3.65497H2.34ZM16 2.34497L10.34 7.99497L16 13.655L21.66 7.99497L16 2.34497Z"
      fill={color}
    />
  </svg>
);
