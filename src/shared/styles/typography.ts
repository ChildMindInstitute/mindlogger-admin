import AffixLight from 'assets/fonts/Affix/Affix-Light.otf';
import AffixMedium from 'assets/fonts/Affix/Affix-Medium.otf';
import ModeratBold from 'assets/fonts/Moderat/Moderat-Bold.woff';
import ModeratBold2 from 'assets/fonts/Moderat/Moderat-Bold.woff2';
import ModeratRegular from 'assets/fonts/Moderat/Moderat-Regular.woff';
import ModeratRegular2 from 'assets/fonts/Moderat/Moderat-Regular.woff2';

export const typography = `
@font-face {
  font-family: 'Moderat';
  font-style: normal;
  font-weight: 700;
  src: url(${ModeratBold}) format('woff'), url(${ModeratBold2}) format('woff2')
}
@font-face {
  font-family: 'Moderat';
  font-weight: 400;
  src: url(${ModeratRegular}) format('woff'), url(${ModeratRegular2}) format('woff2')
}
@font-face {
  font-family: 'Affix';
  font-style: normal;
  font-weight: 500;
  src: url(${AffixMedium}) format('opentype')
}
@font-face {
  font-family: 'Affix';
  font-weight: 300;
  src: url(${AffixLight}) format('opentype')
}
`;
