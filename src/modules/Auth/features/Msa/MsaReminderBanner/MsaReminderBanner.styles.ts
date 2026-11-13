import { Link, LinkProps, styled } from '@mui/material';

// Button-backed link that sits on the sentence's baseline, as in SessionElsewhereBanner
export const StyledReviewLink = styled(Link)<LinkProps<'button'>>`
  vertical-align: baseline;
`;
