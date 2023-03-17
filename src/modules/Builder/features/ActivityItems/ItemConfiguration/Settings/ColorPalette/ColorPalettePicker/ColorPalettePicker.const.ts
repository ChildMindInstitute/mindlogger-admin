import { SELECTION_OPTIONS_COLOR_PALETTE } from 'modules/Builder/features/ActivityItems/ItemConfiguration';

export const RADIO_GROUP_OPTIONS = SELECTION_OPTIONS_COLOR_PALETTE.map(({ name }) => ({
  value: name,
  label: null,
}));
