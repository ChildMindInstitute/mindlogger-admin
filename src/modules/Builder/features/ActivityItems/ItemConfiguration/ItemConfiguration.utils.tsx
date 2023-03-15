import i18n from 'i18n';
import { ItemInputTypes } from 'shared/types';

const { t } = i18n;

export const getInputTypeTooltip = (): Record<ItemInputTypes, string> => ({
  [ItemInputTypes.SingleSelection]: t('provideListChoicesSingleAnswer'),
  [ItemInputTypes.MultipleSelection]: t('provideListChoicesMultipleAnswers'),
  [ItemInputTypes.Slider]: t('createNumericalScale'),
  [ItemInputTypes.Date]: t('promptSelectDate'),
  [ItemInputTypes.NumberSelection]: t('createDropdownNumeric'),
  [ItemInputTypes.TimeRange]: t('promptSelectTimeRange'),
  [ItemInputTypes.SingleSelectionPerRow]: `${t('setupMatrixRadio')} ${t('respondentSelectSingle')}`,
  [ItemInputTypes.MultipleSelectionPerRow]: `${t('setupMatrixCheckboxes')} ${t(
    'respondentSelectMultiple',
  )}`,
  [ItemInputTypes.SliderRows]: t('setupMatrixSliders'),
  [ItemInputTypes.Text]: t('createQuestionWriteAnswer'),
  [ItemInputTypes.Drawing]: t('promptDrawImage'),
  [ItemInputTypes.Photo]: t('promptCapturePhoto'),
  [ItemInputTypes.Video]: t('promptCaptureVideo'),
  [ItemInputTypes.Geolocation]: t('promptAccessLocation'),
  [ItemInputTypes.Audio]: t('promptRecordAudio'),
  [ItemInputTypes.Message]: `${t('addCustomizableMessage')} ${t('noAnswersRequired')}`,
  [ItemInputTypes.AudioPlayer]: `${t('addAudioStimulus')} ${t('noAnswersRequired')}`,
});
