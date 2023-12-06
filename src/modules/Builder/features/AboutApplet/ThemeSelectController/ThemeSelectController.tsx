import { useState } from 'react';
import { FieldValues } from 'react-hook-form';

import { themes } from 'modules/Builder/state';
import { SelectController, SelectControllerProps } from 'shared/components/FormComponents';
import { useInfinityData } from 'shared/hooks/useInfinityData';

import { THEME_LIST_CLASS, THEME_END_ITEM_CLASS } from '../AboutApplet.const';

export const ThemeSelectController = <T extends FieldValues>(props: SelectControllerProps<T>) => {
  const [opened, setOpened] = useState(false);
  const { result: themesList = [], count = 0 } = themes.useThemesData() || {};
  const themesLoadingStatus = themes.useThemesStatus();

  useInfinityData({
    rootSelector: `.${THEME_LIST_CLASS}`,
    targetSelector: `.${THEME_END_ITEM_CLASS}`,
    totalSize: count,
    listSize: themesList.length,
    isLoading: themesLoadingStatus === 'loading',
    getListThunk: themes.thunk.getThemes,
    params: {
      ordering: 'name',
    },
    hasTrigger: opened,
  });

  return (
    <SelectController
      rootSelector={THEME_LIST_CLASS}
      targetSelector={THEME_END_ITEM_CLASS}
      setOpened={setOpened}
      {...props}
    />
  );
};
