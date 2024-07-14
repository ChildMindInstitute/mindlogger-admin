import { IconButton } from '@mui/material';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useCustomFormContext } from 'modules/Builder/hooks';
import { StyledMdPreview } from 'modules/Builder/components/ItemFlowSelectController/StyledMdPreview/StyledMdPreview.styles';
import { Svg } from 'shared/components';
import { InputController, SelectController } from 'shared/components/FormComponents';
import {
  StyledBodyLarge,
  StyledFlexTopCenter,
  StyledLabelLarge,
  theme,
  variables,
} from 'shared/styles';

import { StyledLineBreak } from './PhrasalTemplateField.styles';
import { PhrasalTemplateFieldProps } from './PhrasalTemplateField.types';

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
  const { control, getValues } = useCustomFormContext();

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

  const getRenderedValue = (value: unknown) => {
    if (!value) {
      return (
        <StyledBodyLarge color={variables.palette.outline}>
          {t('phrasalTemplateItem.fieldResponsePlaceholder')}
        </StyledBodyLarge>
      );
    }

    const selectedItem = responseOptions.find(({ id }) => id === value);

    return selectedItem?.name;
  };

  const getRenderedField = () => {
    const fieldValue = getValues(name);
    const { question: selectedOptionQuestion } =
      responseOptions.find(({ id }) => fieldValue.id === id) ?? {};

    switch (type) {
      case 'itemResponse':
        return (
          <SelectController
            name={`${name}.id`}
            control={control}
            defaultValue=""
            fullWidth
            options={responseOptions.map(({ id, name, question }) => ({
              labelKey: name,
              tooltip: <StyledMdPreview modelValue={(question as unknown as string) ?? ''} />,
              value: id ?? '',
            }))}
            SelectProps={{
              displayEmpty: true,
              renderValue: getRenderedValue,
              startAdornment: <Svg aria-hidden id="commentDots" />,
            }}
            TooltipProps={{
              placement: 'left',
              tooltipTitle: selectedOptionQuestion ? (
                <StyledMdPreview modelValue={(selectedOptionQuestion as unknown as string) ?? ''} />
              ) : null,
            }}
          />
        );
      case 'lineBreak':
        return (
          <StyledFlexTopCenter sx={{ height: theme.spacing(5.6), width: '100%' }}>
            <StyledLabelLarge color={variables.palette.outline} sx={{ flexShrink: 0 }}>
              {t('phrasalTemplateItem.fieldLineBreakTitle')}
            </StyledLabelLarge>

            <StyledLineBreak />
          </StyledFlexTopCenter>
        );
      case 'sentence':
      default:
        return (
          <InputController
            control={control}
            InputProps={{ startAdornment: <Svg aria-hidden id="formatText" /> }}
            name={`${name}.text`}
            placeholder={
              otherProps.placeholder ?? t('phrasalTemplateItem.fieldSentencePlaceholder')
            }
            sx={{ ...otherProps.sx, width: '100%' }}
            withDebounce
          />
        );
    }
  };

  return (
    <StyledFlexTopCenter sx={{ gap: 0.8, width: '100%' }}>
      {getRenderedField()}

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
