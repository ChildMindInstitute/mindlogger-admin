import React, { FC } from 'react';
import MdEditor from 'md-editor-rt';
import { useTranslation } from 'react-i18next';

import { Svg } from 'components/Svg';
import { StyledFlexAllCenter } from 'styles/styledComponents';
import theme from 'styles/theme';

import { TrashExtensionProps } from './TrashExtension.types';

const NormalToolbar = MdEditor.NormalToolbar;

const TrashExtension: FC<TrashExtensionProps> = ({ onClick }) => {
  const { t } = useTranslation('app');

  return (
    <NormalToolbar
      title={t('mdEditorTrash')}
      trigger={
        <StyledFlexAllCenter sx={{ p: theme.spacing(0, 0.4) }}>
          <Svg id="md-editor-trash" width="16" height="16" />
        </StyledFlexAllCenter>
      }
      onClick={onClick}
    ></NormalToolbar>
  );
};

export { TrashExtension };
