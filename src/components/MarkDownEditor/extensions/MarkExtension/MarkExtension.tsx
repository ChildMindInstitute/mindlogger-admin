import React from 'react';
import MdEditor, { InsertContentGenerator } from 'md-editor-rt';
import { useTranslation } from 'react-i18next';

import { Svg } from 'components/Svg';

import { MarkExtensionProp } from './MarkExtension.types';

const NormalToolbar = MdEditor.NormalToolbar;

const MarkExtension = (props: MarkExtensionProp) => {
  const { t } = useTranslation('app');
  const markHandler = () => {
    const generator: InsertContentGenerator = (selectedText) => ({
      targetValue: `<mark>${selectedText}</mark>`,
      select: true,
      deviationStart: 0,
      deviationEnd: 0,
    });

    props.onInsert(generator);
  };

  return (
    <NormalToolbar
      title={t('mdEditorMark')}
      onClick={markHandler}
      trigger={<Svg id="md-editor-mark" width="16" height="16" />}
    ></NormalToolbar>
  );
};

export { MarkExtension };
