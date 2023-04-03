import { Svg } from 'shared/components';

export const defaultValues = {
  displayName: '',
  description: '',
  themeId: 'default',
  about: '',
  image: '',
  watermark: '',
};

export const colorThemeOptions = [
  {
    value: 'default',
    labelKey: 'default',
    icon: <Svg id="circle-primary" />,
  },
];
