import NotoSansRegular from 'assets/fonts/NotoSans-Regular.ttf';
import NotoSansMedium from 'assets/fonts/NotoSans-Medium.ttf';
import NotoSansSemiBold from 'assets/fonts/NotoSans-SemiBold.ttf';

export const typography = `
@font-face {
  font-family: 'NotoSans';
  font-style: normal;
  font-weight: 400;
  src: url(${NotoSansRegular}) format('truetype')
}
@font-face {
  font-family: 'NotoSans';
  font-style: normal;
  font-weight: 500;
  src: url(${NotoSansMedium}) format('truetype')
}
@font-face {
  font-family: 'NotoSans';
  font-style: normal;
  font-weight: 600;
  src: url(${NotoSansSemiBold}) format('truetype')
}
`;
