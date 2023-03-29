import { useLocation } from 'react-router-dom';
import { FieldValues, UseFormGetValues } from 'react-hook-form';

import { builderSessionStorage } from 'shared/utils';
import { isActivityRoute, isAppletRoute } from 'modules/Builder/pages/NewApplet/NewApplet.hooks';

/*
 *
 * Top Level [new-applet]: /builder/new-applet
 * 1) About Applet - /about
 * 2) Activities - /activities
 * 3) Activity Flow - /activity-flow
 * 4) Applet Settings - /settings
 *
 * Low Level [new-activity]: /builder/new-applet/activities/new-activity
 * 1) About Activity - /about
 * 2) Items - /items
 * 3) Item Flow - /item-flow
 * 4) Activity Settings - /settings
 *
 * */

export const enum BuilderLayers {
  Applet = 'applet',
  Activity = 'activity',
}

export const getLayer = (path: string) => {
  if (isAppletRoute(path)) return BuilderLayers.Applet;

  if (isActivityRoute(path)) return BuilderLayers.Activity;

  return null;
};

export const useBuilderSessionStorageFormValues = <T>(defaultValues: T) => {
  const { pathname } = useLocation();
  const layer = getLayer(pathname);
  const getFormValues = (): T => {
    if (!layer) return defaultValues;

    const layerStorage = builderSessionStorage.getItem(layer) ?? {};

    return layerStorage[pathname] ?? defaultValues;
  };

  return {
    getFormValues,
  };
};

export const useBuilderSessionStorageApplyChanges = () => {
  const { pathname } = useLocation();
  const layer = getLayer(pathname);

  const applyChanges = (data: Record<string, any>) => {
    if (!layer) return;

    const layerData = builderSessionStorage.getItem(layer) ?? {};
    builderSessionStorage.setItem(layer, {
      ...layerData,
      [pathname]: {
        ...data,
      },
    });
  };

  return {
    applyChanges,
  };
};

export const useBuilderSessionStorageFormChange = <T extends FieldValues>(
  getValues: UseFormGetValues<T>,
) => {
  const { applyChanges } = useBuilderSessionStorageApplyChanges();

  const handleFormChange = () => {
    applyChanges(getValues());
  };

  return {
    handleFormChange,
  };
};
