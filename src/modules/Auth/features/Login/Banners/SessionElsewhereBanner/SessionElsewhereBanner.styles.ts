import { Link, LinkProps, styled } from '@mui/material';

// MUI centres a button-backed link on the line box, which leaves it sitting below the sentence it
// reads as part of. Typed as a button link because styled() drops the polymorphic component prop.
export const StyledReloadLink = styled(Link)<LinkProps<'button'>>`
  vertical-align: baseline;
`;
