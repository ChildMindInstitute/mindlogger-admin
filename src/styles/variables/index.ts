import { palette } from './palette';
import { font } from './font';

export const variables = {
  palette,
  font,
  lineHeight: {
    xxxl: '4rem', //40px
    xxl: '3.2rem', //32px
    xl: '2.8rem', //28px
    lg: '2.4rem', //24px
    md: '2rem', //20px
    sm: '1.6rem', //16px
    xs: '1.4rem', //14px
  },
  letterSpacing: {
    xxl: '0.05rem', //0.5px
    xl: '0.04rem', //0.4px
    lg: '0.025rem', //0.25px
    md: '0.015rem', //0.15px
    sm: '0.01rem', //0.1px
  },
  borderRadius: {
    half: '50%',
    xxxl2: '99.9rem', //999px
    xxxl: '10rem', //100px
    xxl: '3rem', //30px
    xl: '2rem', //20px
    lg2: '1.6rem', //16px
    lg: '1.2rem', //12px
    md: '0.8rem', //8px
    sm: '0.5rem', //5px
    xs: '0.4rem', //4px
    xxs: '0.2rem', //2px
  },
  borderWidth: {
    lg: '0.2rem', //2px
    md: '0.1rem', //1px
  },
  boxShadow: {
    light1: '0 1px 2px rgba(0, 0, 0, 0.3), 0 1px 3px 1px rgba(0, 0, 0, 0.15)',
    light2: '0 1px 2px rgba(0, 0, 0, 0.3), 0 2px 6px 2px rgba(0, 0, 0, 0.15)',
    light3: '0 4px 8px 3px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.3)',
    light4: '0 6px 10px 4px rgba(0, 0, 0, 0.15), 0 2px 3px rgba(0, 0, 0, 0.3)',
    light5: '0 8px 12px 6px rgba(0, 0, 0, 0.15), 0 4px 4px rgba(0, 0, 0, 0.3)',
    dark1: '0 1px 3px 1px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.3)',
    dark2: '0 2px 6px 2px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.3)',
    dark3: '0 4px 8px 3px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.3)',
    dark4: '0 6px 10px 4px rgba(0, 0, 0, 0.15), 0 2px 3px rgba(0, 0, 0, 0.3)',
    dark5: '0 8px 12px 6px rgba(0, 0, 0, 0.15), 0 4px 4px rgba(0, 0, 0, 0.3)',
  },
  transitions: {
    all: 'all 0.3s',
    allLong: 'all 1s',
    bgColor: 'background-color 0.3s',
    border: 'border 0.15s',
  },
};
