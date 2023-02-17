import { Svg } from 'components';

export const defaultValues = {
  name: '',
  description: '',
  colorTheme: 'default',
  aboutApplet: '',
};

export const colorThemeOptions = [
  {
    value: 'default',
    labelKey: 'default',
    icon: <Svg id="circle-primary" />,
  },
];

export type FormValues = {
  name: string;
  description: string;
  colorTheme: string;
  aboutApplet: string;
};
