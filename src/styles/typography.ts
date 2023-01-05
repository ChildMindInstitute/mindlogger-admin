import AtkinsonRegular from 'assets/fonts/AtkinsonHyperlegible-Regular.ttf';
import AtkinsonBold from 'assets/fonts/AtkinsonHyperlegible-Bold.ttf';

export const typography = `
@font-face {
  font-family: 'Atkinson';
  font-style: normal;
  font-weight: 700;
  src: url(${AtkinsonBold}) format('truetype')
}
@font-face {
  font-family: 'Atkinson';
  font-weight: 400;
  src: url(${AtkinsonRegular}) format('truetype')
}
`;
