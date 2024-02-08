import { useCustomFormContext } from 'modules/Builder/hooks';
import { StyledFlexTopCenter, theme } from 'shared/styles';

import { StyledImage } from './DrawingHeader.styles';
import { DrawingHeaderProps } from './DrawingHeader.types';

export const DrawingHeader = ({ open, name }: DrawingHeaderProps) => {
  const { watch } = useCustomFormContext();

  if (open) return null;

  const drawingExampleName = `${name}.responseValues.drawingExample`;
  const drawingBackgroundName = `${name}.responseValues.drawingBackground`;
  const drawingExample = watch(drawingExampleName);
  const drawingBackground = watch(drawingBackgroundName);

  return (
    <StyledFlexTopCenter sx={{ mr: theme.spacing(1) }}>
      {drawingExample && <StyledImage src={drawingExample} />}
      {drawingBackground && <StyledImage src={drawingBackground} />}
    </StyledFlexTopCenter>
  );
};
