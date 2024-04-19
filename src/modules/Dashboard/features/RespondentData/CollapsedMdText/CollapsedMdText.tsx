import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { StyledTitleLargish, variables } from 'shared/styles';
import { useComponentSize } from 'shared/hooks/useComponentSize';
import { toggleBooleanState } from 'shared/utils/toggleBooleanState';

import { StyledBtn, StyledCollapsedContainer, StyledMdPreview } from './CollapsedMdText.styles';
import { CollapsedMdTextProps } from './CollapsedMdText.types';

export const CollapsedMdText = ({
  text,
  maxHeight,
  'data-testid': dataTestid,
}: CollapsedMdTextProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { height } = useComponentSize(containerRef);
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isLarge, setIsLarge] = useState(false);

  useEffect(() => {
    setIsLarge(height > maxHeight);
  }, [height, maxHeight]);

  return (
    <>
      <StyledCollapsedContainer
        isOpen={isOpen}
        maxHeight={maxHeight}
        isLarge={isLarge}
        data-testid={dataTestid}
      >
        <Box ref={containerRef}>
          <StyledMdPreview modelValue={text} />
        </Box>
      </StyledCollapsedContainer>
      {isLarge && (
        <StyledBtn onClick={toggleBooleanState(setIsOpen)} data-testid={`${dataTestid}-collapse`}>
          <StyledTitleLargish color={variables.palette.primary}>
            {t(isOpen ? 'showLess' : 'showMore')}
          </StyledTitleLargish>
        </StyledBtn>
      )}
    </>
  );
};
