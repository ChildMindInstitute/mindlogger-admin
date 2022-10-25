import { SVGProps } from 'react';

export const Widgets = ({
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
      d="M12.34 13.655V21.655H20.34V13.655H12.34ZM2.34003 21.655H10.34V13.655H2.34003V21.655ZM2.34003 3.655V11.655H10.34V3.655H2.34003ZM16 2.345L10.34 7.995L16 13.655L21.66 7.995L16 2.345Z"
      fill={color || 'currentColor'}
    />
  </svg>
);
