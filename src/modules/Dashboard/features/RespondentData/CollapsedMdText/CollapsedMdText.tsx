import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { StyledTitleLargish, variables } from 'shared/styles';

import { StyledBtn, StyledCollapsedContainer, StyledMdEditor } from './CollapsedMdText.styles';
import { CollapsedMdTextProps } from './CollapsedMdText.types';

export const CollapsedMdText = ({ text, maxHeight }: CollapsedMdTextProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isLarge, setIsLarge] = useState(false);

  useEffect(() => {
    if ((containerRef.current?.offsetHeight || 0) > maxHeight) {
      setIsLarge(true);
    }
  }, [isLarge, containerRef]);

  const toggleOpen = () => {
    setIsOpen((state) => !state);
  };

  return (
    <>
      <StyledCollapsedContainer isOpen={isOpen} maxHeight={maxHeight} isLarge={isLarge}>
        <Box ref={containerRef}>
          <StyledMdEditor modelValue={text} previewOnly />
        </Box>
      </StyledCollapsedContainer>
      {isLarge && (
        <StyledBtn onClick={toggleOpen}>
          <StyledTitleLargish color={variables.palette.primary}>
            {t(isOpen ? 'showLess' : 'showMore')}
          </StyledTitleLargish>
        </StyledBtn>
      )}
    </>
  );
};
