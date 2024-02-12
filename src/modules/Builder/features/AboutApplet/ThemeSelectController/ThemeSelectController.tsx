import { useState } from 'react';

import { FieldValues } from 'react-hook-form';

import { themes } from 'modules/Builder/state';
import { SelectController, SelectControllerProps } from 'shared/components/FormComponents';
import { useInfinityData } from 'shared/hooks/useInfinityData';
import { themeParams } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.const';

import { THEME_END_ITEM_CLASS } from '../AboutApplet.const';

export const ThemeSelectController = <T extends FieldValues>(props: SelectControllerProps<T>) => {
  const [trigger, setTrigger] = useState(false);
  const { result: themesList = [], count = 0 } = themes.useThemesData() || {};
  const themesLoadingStatus = themes.useThemesStatus();

  useInfinityData({
    targetSelector: `.${THEME_END_ITEM_CLASS}`,
    totalSize: count,
    listSize: themesList.length,
    isLoading: themesLoadingStatus === 'loading',
    getListThunk: themes.thunk.getThemes,
    params: themeParams,
    hasTrigger: trigger,
  });

  return <SelectController targetSelector={THEME_END_ITEM_CLASS} setTrigger={setTrigger} {...props} />;
};
