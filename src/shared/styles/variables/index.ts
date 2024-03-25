import { palette, modalBackground } from './palette';
import { font } from './font';

export const variables = {
  palette,
  modalBackground,
  font,
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
    xl: '0.4rem', //4px
    lg: '0.2rem', //2px
    md: '0.1rem', //1px
  },
  opacity: {
    hover: 0.85,
    disabled: 0.38,
  },
  boxShadow: {
    light0: '0 1px 2px rgba(0, 0, 0, 0.05), 0 1px 3px 1px rgba(0, 0, 0, 0.05)',
    light1: '0 1px 2px rgba(0, 0, 0, 0.3), 0 1px 3px 1px rgba(0, 0, 0, 0.15)',
    light2: '0 1px 2px rgba(0, 0, 0, 0.3), 0 2px 6px 2px rgba(0, 0, 0, 0.15)',
    light3: '0 6px 6px 0px rgba(0, 0, 0, 0.23), 0 10px 20px 0px rgba(0, 0, 0, 0.19)',
    light4: '0 6px 10px 4px rgba(0, 0, 0, 0.15), 0 2px 3px rgba(0, 0, 0, 0.3)',
    light5: '0 15px 12px 0px rgba(0, 0, 0, 0.22), 0 19px 38px 0px rgba(0, 0, 0, 0.30)',
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
    opacity: 'opacity 0.3s',
    boxShadow: 'box-shadow 0.3s',
    width: 'width 0.3s ease-in',
    fontWeight: 'font-weight 0.3s',
    fontSize: 'font-size 0.3s',
  },
};
