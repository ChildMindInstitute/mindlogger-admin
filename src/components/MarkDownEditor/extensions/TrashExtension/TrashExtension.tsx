import React, { FC } from 'react';
import MdEditor from 'md-editor-rt';
import { useTranslation } from 'react-i18next';

import { Svg } from 'components/Svg';

import { TrashExtensionProps } from './TrashExtension.types';

const NormalToolbar = MdEditor.NormalToolbar;

const TrashExtension: FC<TrashExtensionProps> = ({ onClick }) => {
  const { t } = useTranslation('app');

  return (
    <NormalToolbar
      title={t('mdEditorTrash')}
      trigger={<Svg id="md-editor-trash" width="16" height="16" />}
      onClick={onClick}
    ></NormalToolbar>
  );
};

export { TrashExtension };
