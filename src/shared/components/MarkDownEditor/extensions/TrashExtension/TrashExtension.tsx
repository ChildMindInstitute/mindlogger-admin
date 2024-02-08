import { NormalToolbar } from 'md-editor-rt';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components/Svg';

import { StyledIconCenter } from '../Extensions.styles';
import { TrashExtensionProps } from './TrashExtension.types';

export const TrashExtension = ({ onClick }: TrashExtensionProps) => {
  const { t } = useTranslation('app');

  return (
    <NormalToolbar
      title={t('trash')}
      trigger={
        <StyledIconCenter>
          <Svg id="md-editor-trash" />
        </StyledIconCenter>
      }
      onClick={onClick}
    />
  );
};
