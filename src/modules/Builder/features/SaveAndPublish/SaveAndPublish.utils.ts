import { storage } from 'shared/utils';
import { auth } from 'modules/Auth';
import {
  applet,
  ResponseValues,
  SingleAndMultipleSelectItemResponseValues,
  SliderItemResponseValues,
} from 'shared/state';
import { useCheckIfNewApplet } from 'shared/hooks';
import { ItemResponseType } from 'shared/consts';
import { ColorResult } from 'react-color';

export const removeAppletExtraFields = () => ({
  createdAt: undefined,
  updatedAt: undefined,
  id: undefined,
  retentionPeriod: undefined,
  retentionType: undefined,
  theme: undefined,
  version: undefined,
  subscales: undefined, // TODO: remove when API will be ready
  scores: undefined, // TODO: remove when API will be ready
  sections: undefined, // TODO: remove when API will be ready
  calculateTotalScore: undefined, // TODO: remove when API will be ready
  calculateTotalScoreSwitch: undefined, // TODO: remove when API will be ready
});

export const removeActivityExtraFields = () => ({ order: undefined });

export const removeItemExtraFields = () => ({
  key: undefined,
  settings: undefined,
  alerts: undefined, //TODO: remove after backend addings
});

export const mapItemResponseValues = (
  responseType: ItemResponseType,
  responseValues: ResponseValues,
) => {
  if (
    responseType === ItemResponseType.SingleSelection ||
    responseType === ItemResponseType.MultipleSelection
  )
    return {
      paletteName:
        (responseValues as SingleAndMultipleSelectItemResponseValues).paletteName ?? undefined,
      options: (responseValues as SingleAndMultipleSelectItemResponseValues).options?.map(
        (option) => ({
          ...option,
          color: (option.color as ColorResult)?.hex ?? option.color ?? undefined,
        }),
      ),
    };

  if (responseType === ItemResponseType.Slider)
    return {
      ...(responseValues as SliderItemResponseValues),
      options: undefined,
    };

  return null;
};

const getPasswordKey = (ownerId: string, appletId: string) => `pwd/${ownerId}/${appletId}`;

export const usePasswordFromStorage = () => {
  const isNewApplet = useCheckIfNewApplet();
  const userData = auth.useData();
  const ownerId = String(userData?.user?.id) || '';
  const { result: appletData } = applet.useAppletData() ?? {};

  const getPassword = () => {
    if (isNewApplet) return '';
    const appletId = appletData?.id ?? '';

    return storage.getItem(getPasswordKey(ownerId, appletId)) as string;
  };

  const setPassword = (appletId: string, password: string) => {
    storage.setItem(getPasswordKey(ownerId, appletId), password);
  };

  return {
    getPassword,
    setPassword,
  };
};
