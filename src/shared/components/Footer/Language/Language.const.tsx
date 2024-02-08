import { Languages } from 'shared/api';
import { Svg } from 'shared/components/Svg';

import { LanguageItem } from './Language.types';

export const languages: LanguageItem[] = [
  {
    value: Languages.EN,
    label: 'English',
    type: 'United States',
    component: <Svg id="us" width={32} height={24} />,
  },
  {
    value: Languages.FR,
    label: 'Français',
    type: 'France',
    component: <Svg id="france" width={32} height={24} />,
  },
];
