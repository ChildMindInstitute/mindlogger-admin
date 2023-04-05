import i18n from 'i18n';
import { Svg } from 'shared/components';

export const getButtons = () => {
  const { t } = i18n;

  return [
    { label: t('addActivity'), icon: <Svg id="add" width={18} height={18} /> },
    { label: t('clearFlow'), icon: <Svg id="cross" width={18} height={18} /> },
  ];
};
