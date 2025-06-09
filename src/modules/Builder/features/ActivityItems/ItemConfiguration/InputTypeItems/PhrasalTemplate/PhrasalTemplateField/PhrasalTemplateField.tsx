import { IconButton } from '@mui/material';
import { useCallback, useRef, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';

import { Menu, Svg } from 'shared/components';
import { StyledFlexTopCenter, variables } from 'shared/styles';

import { KEYWORDS } from './PhrasalTemplateField.const';
import { StyledFlexTopCenterDraggable } from './PhrasalTemplateField.styles';
import { PhrasalTemplateFieldProps } from './PhrasalTemplateField.types';
import { RenderedField } from './PhrasalTemplateRenderField';

export const PhrasalTemplateField = ({
  canRemove = false,
  name = '',
  onRemove,
  responseOptions = [],
  type = KEYWORDS.SENTENCE,
  itemId,
  index,
  ...otherProps
}: PhrasalTemplateFieldProps) => {
  const [isExpandedMenuOpen, setIsExpandedMenuOpen] = useState<boolean>(false);
  const [removeItemMenuAnchorEl, setRemoveItemMenuAnchorEl] = useState<null | HTMLElement>(null);
  const isRemoveItemMenuOpen = Boolean(removeItemMenuAnchorEl);
  const menuRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('app');

  const showExpandedMenu = useCallback(() => {
    setIsExpandedMenuOpen(true);
  }, []);

  const hideExpandedMenu = useCallback(() => {
    if (!isRemoveItemMenuOpen) {
      setIsExpandedMenuOpen(false);
    }
  }, [isRemoveItemMenuOpen]);

  const handleOpenRemoveItemMenu = useCallback((evt: React.MouseEvent<HTMLButtonElement>) => {
    setRemoveItemMenuAnchorEl(evt.currentTarget);
  }, []);

  const handleCloseRemoveItemMenu = useCallback(() => {
    setRemoveItemMenuAnchorEl(null);
    setIsExpandedMenuOpen(false);
  }, []);

  return (
    <>
      <Draggable index={index} draggableId={itemId}>
        {(draggableProvided, snapshot, rubric) => (
          <StyledFlexTopCenterDraggable
            sx={{ gap: 0.8 }}
            ref={draggableProvided.innerRef}
            {...draggableProvided.draggableProps}
            isDragging={snapshot.isDragging && rubric.draggableId === itemId}
          >
            <RenderedField
              name={name}
              responseOptions={responseOptions}
              type={type}
              index={index}
              itemId={itemId}
              sx={{ '.MuiFormHelperText-root': { mb: 0.4 } }}
              {...otherProps}
            />
            <StyledFlexTopCenter
              onBlur={hideExpandedMenu}
              onMouseEnter={showExpandedMenu}
              onMouseLeave={hideExpandedMenu}
              ref={menuRef}
              sx={{ gap: 0.8 }}
            >
              {isExpandedMenuOpen ? (
                <>
                  <IconButton
                    color="default"
                    disabled={!canRemove}
                    onClick={handleOpenRemoveItemMenu}
                  >
                    <Svg
                      aria-label={t('phrasalTemplateItem.btnRemoveField')}
                      fill="currentColor"
                      id="trash"
                    />
                  </IconButton>
                  <IconButton color="default" {...draggableProvided.dragHandleProps}>
                    <Svg
                      aria-label={t('phrasalTemplateItem.btnOrderField')}
                      fill="currentColor"
                      id="drag"
                    />
                  </IconButton>
                </>
              ) : (
                <IconButton
                  color="default"
                  onMouseEnter={showExpandedMenu}
                  onMouseLeave={hideExpandedMenu}
                  {...draggableProvided.dragHandleProps}
                >
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
          </StyledFlexTopCenterDraggable>
        )}
      </Draggable>
      <Menu
        anchorEl={removeItemMenuAnchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        width="23.2rem"
        onClose={handleCloseRemoveItemMenu}
        menuItems={[
          {
            action: onRemove,
            icon: <Svg id="trash" />,
            title: 'remove',
            customItemColor: variables.palette.error,
          },
        ]}
      />
    </>
  );
};
