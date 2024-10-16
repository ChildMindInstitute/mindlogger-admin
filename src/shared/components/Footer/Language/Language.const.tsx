import { Svg } from 'shared/components/Svg';
import { UiLanguages } from 'shared/ui';

import { LanguageItem } from './Language.types';

export const languages: LanguageItem[] = [
  {
    value: UiLanguages.EN,
    label: 'English',
    type: 'United States',
    component: <Svg id="us" width={32} height={24} />,
  },
  {
    value: UiLanguages.FR,
    label: 'Français',
    type: 'France',
    component: <Svg id="france" width={32} height={24} />,
  },
];
