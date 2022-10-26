import NotoSansRegular from 'src/assets/fonts/NotoSans-Regular.ttf';
import NotoSansMedium from 'src/assets/fonts/NotoSans-Medium.ttf';
import NotoSansSemiBold from 'src/assets/fonts/NotoSans-SemiBold.ttf';

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
