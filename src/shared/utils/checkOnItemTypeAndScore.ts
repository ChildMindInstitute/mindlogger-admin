import { ItemsWithScore } from 'modules/Builder/features/ActivitySettings/ScoresAndReports/ScoreContent/ScoreContent.types';
import { ItemFormValues } from 'modules/Builder/types';
import {
  Item,
  SingleSelectionConfig,
  MultipleSelectionConfig,
  SliderConfig,
} from 'shared/state/Applet';
import { ItemResponseType } from 'shared/consts';

export const checkOnItemTypeAndScore = (item: ItemFormValues | Item): item is ItemsWithScore =>
  (item.config as SingleSelectionConfig | MultipleSelectionConfig | SliderConfig)?.addScores &&
  [
    ItemResponseType.SingleSelection,
    ItemResponseType.MultipleSelection,
    ItemResponseType.Slider,
  ].includes(item.responseType);
