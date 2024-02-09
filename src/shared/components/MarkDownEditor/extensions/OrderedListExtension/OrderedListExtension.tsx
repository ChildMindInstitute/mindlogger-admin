import { NormalToolbar, InsertContentGenerator } from 'md-editor-rt';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components/Svg';

import { StyledOrderedListIcon } from '../Extensions.styles';
import { InsertContentExtensionProps } from '../Extensions.types';

export const OrderedListExtension = ({ onInsert }: InsertContentExtensionProps) => {
  const { t } = useTranslation('app');

  const markHandler = () => {
    let index = 1;
    const generator: InsertContentGenerator = (selectedText) => ({
      targetValue: selectedText.replace(/^.*$/gm, (match) => `${index++}. ${match}`),
      select: true,
      deviationStart: 0,
      deviationEnd: 0,
    });
    onInsert(generator);
  };

  return (
    <NormalToolbar
      title={t('orderedList')}
      onClick={markHandler}
      trigger={
        <StyledOrderedListIcon>
          <Svg id="md-editor-ordered-list" />
        </StyledOrderedListIcon>
      }
    />
  );
};
