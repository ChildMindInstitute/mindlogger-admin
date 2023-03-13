import MdEditor, { InsertContentGenerator } from 'md-editor-rt';

import { Svg } from 'shared/components';

import { AlignTextExtensionProps } from './AlignTextExtension.types';
import { StyledIconCenter } from '../Extensions.styles';

const NormalToolbar = MdEditor.NormalToolbar;

export const AlignTextExtension = ({ onInsert, type, title }: AlignTextExtensionProps) => {
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
      trigger={
        <StyledIconCenter>
          <Svg id={`md-editor-align-${type}`} />
        </StyledIconCenter>
      }
    />
  );
};
