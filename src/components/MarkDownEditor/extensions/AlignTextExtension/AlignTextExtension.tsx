import React, { FC } from 'react';
import MdEditor, { InsertContentGenerator } from 'md-editor-rt';

import { Svg } from 'components/Svg';

import { AlignTextExtensionProps } from './AlignTextExtension.types';

const NormalToolbar = MdEditor.NormalToolbar;

const AlignTextExtension: FC<AlignTextExtensionProps> = ({
  onInsert,
  type,
  title,
}: AlignTextExtensionProps) => {
  const markHandler = () => {
    const generator: InsertContentGenerator = (selectedText) => ({
      targetValue: `<div style="text-align:${type};"><p>${selectedText}</p></div>`,
      select: true,
      deviationStart: 0,
      deviationEnd: 0,
    });

    onInsert(generator);
  };

  return (
    <NormalToolbar
      title={title}
      onClick={markHandler}
      trigger={<Svg id={`md-editor-align-${type}`} width="14" height="14" />}
    ></NormalToolbar>
  );
};

export { AlignTextExtension };
