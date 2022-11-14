import { SVGProps } from 'react';

import { variables } from 'styles/variables';

export const Respondent = ({
  width = 24,
  height = 24,
  color = variables.palette.shades80,
}: SVGProps<SVGElement>): JSX.Element => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 2H4C3.46957 2 2.96086 2.21071 2.58579 2.58579C2.21071 2.96086 2 3.46957 2 4V16C2 16.5304 2.21071 17.0391 2.58579 17.4142C2.96086 17.7893 3.46957 18 4 18H8L12 22L16 18H20C20.5304 18 21.0391 17.7893 21.4142 17.4142C21.7893 17.0391 22 16.5304 22 16V4C22 3.46957 21.7893 2.96086 21.4142 2.58579C21.0391 2.21071 20.5304 2 20 2ZM12 4.3C13.5 4.3 14.7 5.5 14.7 7C14.7 8.5 13.5 9.7 12 9.7C10.5 9.7 9.3 8.5 9.3 7C9.3 5.5 10.5 4.3 12 4.3ZM18 15H6V14.1C6 12.1 10 11 12 11C14 11 18 12.1 18 14.1V15Z"
      fill={color || 'currentColor'}
    />
  </svg>
);
