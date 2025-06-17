import { font } from './font';
import { modalBackground, palette } from './palette';

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
    md2: '0.15rem', //1.5px
    md: '0.1rem', //1px
  },
  opacity: {
    noOpacity: 1,
    hover: 0.85,
    halfDisabled: 0.64,
    disabled: 0.38,
  },
  boxShadow: {
    buttonElevation1: '0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24)',
    buttonElevation2: '0px 3px 6px rgba(0, 0, 0, 0.16), 0px 3px 6px rgba(0, 0, 0, 0.23)',
    light0: '0px 1px 2px 0px rgba(0, 0, 0, 0.05), 0 1px 3px 1px rgba(0, 0, 0, 0.05)',
    light1: '0px 1px 3px 0px rgba(0, 0, 0, 0.12), 0px 1px 2px 0px rgba(0, 0, 0, 0.24)',
    light2: '0px 3px 6px 0px rgba(0, 0, 0, 0.16), 0px 3px 6px 0px rgba(0, 0, 0, 0.23)',
    light3: '0px 10px 20px 0px rgba(0, 0, 0, 0.19), 0px 6px 6px 0px rgba(0, 0, 0, 0.23)',
    light4: '0px 14px 28px 0px rgba(0, 0, 0, 0.25), 0px 10px 10px 0px rgba(0, 0, 0, 0.22)',
    light5: '0px 19px 38px 0px rgba(0, 0, 0, 0.30), 0px 15px 12px 0px rgba(0, 0, 0, 0.22)',
    dark1:
      '0px 1px 3px 0px rgba(0, 0, 0, 0.12), 0px 1px 2px 0px rgba(0, 0, 0, 0.24), 0px 8px 48px 0px rgba(255, 255, 255, 0.03)',
    dark2:
      '0px 3px 6px 0px rgba(0, 0, 0, 0.16), 0px 3px 6px 0px rgba(0, 0, 0, 0.23), 0px 10px 60px 0px rgba(255, 255, 255, 0.03)',
    dark3:
      '0px 10px 20px 0px rgba(0, 0, 0, 0.19), 0px 6px 6px 0px rgba(0, 0, 0, 0.23), 0px 12px 72px 0px rgba(255, 255, 255, 0.03)',
    dark4:
      '0px 14px 28px 0px rgba(0, 0, 0, 0.25), 0px 10px 10px 0px rgba(0, 0, 0, 0.22), 0px 14px 84px 0px rgba(255, 255, 255, 0.03)',
    dark5:
      '0px 19px 38px 0px rgba(0, 0, 0, 0.30), 0px 15px 12px  0px rgba(0, 0, 0, 0.22), 0px 16px 96px 0px rgba(255, 255, 255, 0.03)',
    soft: '0px 0px 8px rgba(0, 0, 0, 0.08)',
    soft2: '0px 0px 16px rgba(0, 0, 0, 0.08)',
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
