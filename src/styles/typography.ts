import NotoSansRegular from 'assets/fonts/NotoSans-Regular.ttf';
import NotoSansMedium from 'assets/fonts/NotoSans-Medium.ttf';
import NotoSansSemiBold from 'assets/fonts/NotoSans-SemiBold.ttf';

export const notoSansRegular = {
  fontFamily: 'NotoSans',
  fontStyle: 'normal',
  fontWeight: 400,
  src: `
    url(${NotoSansRegular}) format('truetype')
  `,
};

export const notoSansMedium = {
  fontFamily: 'NotoSans',
  fontStyle: 'normal',
  fontWeight: 500,
  src: `
    url(${NotoSansMedium}) format('truetype')
  `,
};

export const notoSansSemiBold = {
  fontFamily: 'NotoSans',
  fontStyle: 'normal',
  fontWeight: 600,
  src: `
    url(${NotoSansSemiBold}) format('truetype')
  `,
};
