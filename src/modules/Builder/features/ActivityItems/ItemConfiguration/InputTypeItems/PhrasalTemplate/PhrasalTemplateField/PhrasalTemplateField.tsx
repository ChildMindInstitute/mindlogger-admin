import { IconButton } from '@mui/material';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import { StyledFlexTopCenter } from 'shared/styles';

import { PhrasalTemplateFieldProps } from './PhrasalTemplateField.types';
import { RenderedField } from './PhrasalTemplateRenderField';

export const PhrasalTemplateField = ({
  canRemove = false,
  name = '',
  onRemove,
  responseOptions = [],
  type = 'sentence',
  ...otherProps
}: PhrasalTemplateFieldProps) => {
  const [showExpandedMenu, setShowExpandedMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('app');

  const handleFocusMenu = () => {
    setShowExpandedMenu(true);
  };

  const handleMouseEnterMenu = () => {
    setShowExpandedMenu(true);
  };

  const handleHoverLeaveMenu = () => {
    if (document.activeElement) {
      const children = menuRef.current?.childNodes;
      const activeElIsChild = [...(children ?? [])].includes(document.activeElement);

      if (activeElIsChild) {
        return;
      }
    }

    setShowExpandedMenu(false);
  };

  const handleBlurMenu: React.FocusEventHandler<HTMLDivElement> = (e) => {
    if (e.relatedTarget) {
      const children = menuRef.current?.childNodes;
      const relatedTargetIsChild = [...(children ?? [])].includes(e.relatedTarget);

      if (relatedTargetIsChild) {
        return;
      }
    }

    setShowExpandedMenu(false);
  };

  return (
    <StyledFlexTopCenter sx={{ gap: 0.8, width: '100%' }}>
      <RenderedField name={name} responseOptions={responseOptions} type={type} {...otherProps} />
      <StyledFlexTopCenter
        onBlur={handleBlurMenu}
        onMouseEnter={handleMouseEnterMenu}
        onMouseLeave={handleHoverLeaveMenu}
        ref={menuRef}
        sx={{ gap: 0.8 }}
      >
        {showExpandedMenu ? (
          <>
            <IconButton color="default" disabled={!canRemove} onClick={onRemove}>
              <Svg
                aria-label={t('phrasalTemplateItem.btnRemoveField')}
                fill="currentColor"
                id="trash"
              />
            </IconButton>

            {/* TODO: M2-7183 — Draggable re-ordering of phrase fields */}
            <IconButton color="default" disabled>
              <Svg
                aria-label={t('phrasalTemplateItem.btnOrderField')}
                fill="currentColor"
                id="drag"
              />
            </IconButton>
          </>
        ) : (
          <IconButton color="default" onFocus={handleFocusMenu}>
            <Svg
              aria-label={t('phrasalTemplateItem.btnShowFieldControls')}
              fill="currentColor"
              id="dots"
              height={18}
              width={18}
            />
          </IconButton>
        )}
      </StyledFlexTopCenter>
    </StyledFlexTopCenter>
  );
};
