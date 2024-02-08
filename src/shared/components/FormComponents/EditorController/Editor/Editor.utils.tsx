import { ToolbarNames } from 'md-editor-rt';

import i18n from 'i18n';
import {
  AlignTextExtension,
  AudioUploadExtension,
  ImageUploadExtension,
  MarkExtension,
  OrderedListExtension,
  SubscriptExtension,
  SuperscriptExtension,
  TrashExtension,
  UnderlineExtension,
  UnorderedListExtension,
  VideoUploadExtension,
} from 'shared/components/MarkDownEditor';
import { Svg } from 'shared/components/Svg';
import { MAX_FILE_SIZE_150MB, MAX_FILE_SIZE_25MB } from 'shared/consts';

import { StyledIcon, StyledPageFullscreenIcon, StyledStrikeThroughIcon } from './Editor.styles';
import { GetDefToolbars } from './Editor.types';

const { t } = i18n;

export const getDefToolbars = ({
  onInsert,
  onChange,
  setFileSizeExceeded,
  setIncorrectFormat,
  setIsLoading,
}: GetDefToolbars) => {
  const commonMediaProps = {
    onInsert,
    setFileSizeExceeded,
    setIncorrectFormat,
    setIsLoading,
  };

  return [
    <MarkExtension key="mark-extension" onInsert={onInsert} />,
    <TrashExtension
      key="trash-extension"
      onClick={() => {
        onChange('');
      }}
    />,
    <AlignTextExtension key="align-left-extension" type="left" title={t('alignLeft')} onInsert={onInsert} />,
    <AlignTextExtension key="align-center-extension" type="center" title={t('alignCenter')} onInsert={onInsert} />,
    <AlignTextExtension key="align-right-extension" type="right" title={t('alignRight')} onInsert={onInsert} />,
    <ImageUploadExtension {...commonMediaProps} key="image-upload-extension" fileSizeExceeded={MAX_FILE_SIZE_25MB} />,
    <AudioUploadExtension {...commonMediaProps} key="audio-upload-extension" fileSizeExceeded={MAX_FILE_SIZE_150MB} />,
    <VideoUploadExtension {...commonMediaProps} key="video-upload-extension" fileSizeExceeded={MAX_FILE_SIZE_150MB} />,
    <UnderlineExtension key="underline-extension" onInsert={onInsert} />,
    <SubscriptExtension key="subscript-extension" onInsert={onInsert} />,
    <SuperscriptExtension key="superscript-extension" onInsert={onInsert} />,
    <OrderedListExtension key="orderedList-extension" onInsert={onInsert} />,
    <UnorderedListExtension key="unorderedList-extension" onInsert={onInsert} />,
  ];
};

export const getCustomIcons = () => ({
  bold: {
    component: () => (
      <StyledIcon>
        <Svg id="md-editor-bold" />
      </StyledIcon>
    ),
  },
  italic: {
    component: () => (
      <StyledIcon>
        <Svg id="md-editor-italic" />
      </StyledIcon>
    ),
  },
  title: {
    component: () => (
      <StyledIcon>
        <Svg id="md-editor-title" />
      </StyledIcon>
    ),
  },
  'strike-through': {
    component: () => (
      <StyledStrikeThroughIcon>
        <Svg id="md-editor-strikeThrough" />
      </StyledStrikeThroughIcon>
    ),
  },
  quote: {
    component: () => (
      <StyledIcon>
        <Svg id="md-editor-quote" />
      </StyledIcon>
    ),
  },
  link: {
    component: () => (
      <StyledIcon>
        <Svg id="md-editor-link" />
      </StyledIcon>
    ),
  },
  'code-row': {
    component: () => (
      <StyledIcon>
        <Svg id="md-editor-codeRow" />
      </StyledIcon>
    ),
  },
  table: {
    component: () => (
      <StyledIcon>
        <Svg id="md-editor-table" />
      </StyledIcon>
    ),
  },
  revoke: {
    component: () => (
      <StyledIcon>
        <Svg id="md-editor-revoke" />
      </StyledIcon>
    ),
  },
  next: {
    component: () => (
      <StyledIcon>
        <Svg id="md-editor-next" />
      </StyledIcon>
    ),
  },
  catalog: {
    component: () => (
      <StyledIcon>
        <Svg id="md-editor-catalog" />
      </StyledIcon>
    ),
  },
  preview: {
    component: () => (
      <StyledIcon>
        <Svg id="md-editor-preview" />
      </StyledIcon>
    ),
  },
  fangda: {
    component: () => (
      <StyledPageFullscreenIcon>
        <Svg id="md-editor-pageFullscreen" />
      </StyledPageFullscreenIcon>
    ),
  },
  coding: {
    component: () => (
      <StyledIcon>
        <Svg id="md-editor-htmlPreview" />
      </StyledIcon>
    ),
  },
});

export const getToolbars = (): ToolbarNames[] => [
  'bold',
  'italic',
  'title',
  '-',
  8, // UnderlineExtension
  'strikeThrough',
  0, // MarkExtension
  9, // SubscriptExtension
  10, // SuperscriptExtension
  2, // AlignTextExtension: left
  3, // AlignTextExtension: center
  4, // AlignTextExtension: right
  '-',
  'quote',
  11, // OrderedListExtension
  12, // UnorderedListExtension
  'link',
  'codeRow',
  'table',
  '-',
  'revoke',
  'next',
  1, // TrashExtension
  5, // ImageUploadExtension
  6, // AudioUploadExtension
  7, // VideoUploadExtension
  '-',
  'catalog',
  'preview',
  'pageFullscreen',
  'htmlPreview',
];
