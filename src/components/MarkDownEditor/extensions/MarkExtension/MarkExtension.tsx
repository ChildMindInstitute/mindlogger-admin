import React from 'react';
import MdEditor, { InsertContentGenerator } from 'md-editor-rt';
import { useTranslation } from 'react-i18next';

import { Svg } from 'components';
import { StyledFlexAllCenter } from 'styles/styledComponents';
import theme from 'styles/theme';

import { InsertContentExtensionProps } from '../extensions.types';

const NormalToolbar = MdEditor.NormalToolbar;

const MarkExtension = ({ onInsert }: InsertContentExtensionProps) => {
  const { t } = useTranslation('app');
  const markHandler = () => {
    const generator: InsertContentGenerator = (selectedText) => ({
      targetValue: `<mark>${selectedText}</mark>`,
      select: true,
      deviationStart: 0,
      deviationEnd: 0,
    });

    onInsert(generator);
  };

  return (
    <NormalToolbar
      title={t('mdEditorMark')}
      onClick={markHandler}
      trigger={
        <StyledFlexAllCenter sx={{ p: theme.spacing(0, 0.4) }}>
          <Svg id="md-editor-mark" width="16" height="16" />
        </StyledFlexAllCenter>
      }
    ></NormalToolbar>
  );
};

export { MarkExtension };
