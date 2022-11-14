import { StyledFooter, StyledLink, StyledText } from './Footer.styles';

export const Footer = () => (
  <StyledFooter>
    <StyledLink target="_blank" href="https://childmind.org">
      Child Mind Institute
    </StyledLink>
    <StyledText component="span">Matter LAB 2022</StyledText>
    <StyledLink target="_blank" href="https://mindlogger.org/terms">
      Terms of Service
    </StyledLink>
  </StyledFooter>
);
