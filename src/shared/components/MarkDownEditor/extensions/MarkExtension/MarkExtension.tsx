import { NormalToolbar, InsertContentGenerator } from 'md-editor-rt';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components/Svg';

import { InsertContentExtensionProps } from '../Extensions.types';
import { StyledIconCenter } from '../Extensions.styles';

export const MarkExtension = ({ onInsert }: InsertContentExtensionProps) => {
  const { t } = useTranslation('app');
  const markHandler = () => {
    const generator: InsertContentGenerator = (selectedText) => ({
      targetValue: `==${selectedText}==`,
      select: true,
      deviationStart: 0,
      deviationEnd: 0,
    });

    onInsert(generator);
  };

  return (
    <NormalToolbar
      title={t('mark')}
      onClick={markHandler}
      trigger={
        <StyledIconCenter>
          <Svg id="md-editor-mark" />
        </StyledIconCenter>
      }
    />
  );
};
