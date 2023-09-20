import { Svg } from 'shared/components/Svg';

import { StyledButtonGroup, StyledActionBtn } from './ActionButtons.styles';
import { ActionButtonsProps } from './ActionButtons.types';

export const ActionButtons = ({
  isPrimaryUiType,
  showFirstButton,
  showSecondButton,
  onEditImg,
  onDeleteImg,
}: ActionButtonsProps) => {
  const svgSize = isPrimaryUiType ? '18' : '24';

  return (
    <StyledButtonGroup
      isPrimaryUiType={isPrimaryUiType}
      variant="outlined"
      aria-label="button group"
    >
      {showFirstButton && (
        <StyledActionBtn isPrimaryUiType={isPrimaryUiType} onClick={onEditImg}>
          <Svg width={svgSize} height={svgSize} id="edit" />
        </StyledActionBtn>
      )}
      {showSecondButton && (
        <StyledActionBtn isPrimaryUiType={isPrimaryUiType} onClick={onDeleteImg}>
          <Svg width={svgSize} height={svgSize} id="trash" />
        </StyledActionBtn>
      )}
    </StyledButtonGroup>
  );
};
