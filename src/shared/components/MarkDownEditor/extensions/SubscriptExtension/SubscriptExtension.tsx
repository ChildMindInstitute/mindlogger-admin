import { NormalToolbar, InsertContentGenerator } from 'md-editor-rt';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components/Svg';

import { StyledIconCenter } from '../Extensions.styles';
import { InsertContentExtensionProps } from '../Extensions.types';

export const SubscriptExtension = ({ onInsert }: InsertContentExtensionProps) => {
  const { t } = useTranslation('app');
  const handler = () => {
    const generator: InsertContentGenerator = selectedText => ({
      targetValue: `~${selectedText}~`,
      select: true,
      deviationStart: 0,
      deviationEnd: 0,
    });

    onInsert(generator);
  };

  return (
    <NormalToolbar
      title={t('subscript')}
      onClick={handler}
      trigger={
        <StyledIconCenter>
          <Svg id="md-editor-subscript" />
        </StyledIconCenter>
      }
    />
  );
};
