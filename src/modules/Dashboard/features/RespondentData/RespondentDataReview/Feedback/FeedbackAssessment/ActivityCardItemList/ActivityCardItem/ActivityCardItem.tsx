import { ItemPicker } from './ItemPicker';
import { ActivityCardItemProps, ItemCardButtonsConfig } from './ActivityCardItem.types';
import { StyledCardItemContainer, StyledMdEditor } from './ActivityCardItem.styles';
import { ItemCardButtons } from './ItemCardButtons';

export const ActivityCardItem = ({
  activityItem,
  isBackVisible,
  isSubmitVisible,
  step,
  toNextStep,
  toPrevStep,
  isActive,
  onSubmit,
}: ActivityCardItemProps) => {
  const buttonConfig: ItemCardButtonsConfig = {
    isSkippable: activityItem.config.skippableItem && !isSubmitVisible,
    isBackVisible: isBackVisible && !activityItem.config.removeBackButton,
  };

  const onNextButtonClick = () => {
    if (toNextStep) {
      toNextStep();
    }
  };

  const onBackButtonClick = () => {
    if (toPrevStep) {
      toPrevStep();
    }
  };

  return (
    <StyledCardItemContainer>
      <StyledMdEditor modelValue={activityItem.question} previewOnly />
      <ItemPicker step={step} item={activityItem} isDisabled={!isActive} />
      {isActive && (
        <ItemCardButtons
          step={step}
          config={buttonConfig}
          isSubmitVisible={isSubmitVisible}
          onNextButtonClick={onNextButtonClick}
          onBackButtonClick={onBackButtonClick}
          onSubmit={onSubmit}
        />
      )}
    </StyledCardItemContainer>
  );
};
