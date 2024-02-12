import { useTranslation } from 'react-i18next';
import { NormalToolbar, InsertContentGenerator } from 'md-editor-rt';

import { Svg } from 'shared/components/Svg';

import { StyledUnorderedListIcon } from '../Extensions.styles';
import { InsertContentExtensionProps } from '../Extensions.types';

export const UnorderedListExtension = ({ onInsert }: InsertContentExtensionProps) => {
  const { t } = useTranslation('app');

  const markHandler = () => {
    const generator: InsertContentGenerator = (selectedText) => ({
      targetValue: selectedText.replace(/^.*$/gm, (match) => `- ${match}`),
      select: true,
      deviationStart: 0,
      deviationEnd: 0,
    });
    onInsert(generator);
  };

  return (
    <NormalToolbar
      title={t('unorderedList')}
      onClick={markHandler}
      trigger={
        <StyledUnorderedListIcon>
          <Svg id="md-editor-unordered-list" />
        </StyledUnorderedListIcon>
      }
    />
  );
};
