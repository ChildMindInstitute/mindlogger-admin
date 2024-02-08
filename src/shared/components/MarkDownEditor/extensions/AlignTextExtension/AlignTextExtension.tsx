import { NormalToolbar, InsertContentGenerator } from 'md-editor-rt';

import { Svg } from 'shared/components/Svg';

import { AlignTextExtensionProps } from './AlignTextExtension.types';
import { StyledIconCenter } from '../Extensions.styles';

export const AlignTextExtension = ({ onInsert, type, title }: AlignTextExtensionProps) => {
  const markHandler = () => {
    const generator: InsertContentGenerator = selectedText => ({
      targetValue: `::: hljs-${type}
${selectedText} 
:::`,
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
