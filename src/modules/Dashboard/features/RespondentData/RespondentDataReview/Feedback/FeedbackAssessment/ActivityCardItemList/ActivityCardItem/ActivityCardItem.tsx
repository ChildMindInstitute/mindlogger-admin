import { CollapsedMdText } from 'modules/Dashboard/features/RespondentData/CollapsedMdText';
import { getDictionaryText } from 'shared/utils';

import { StyledCardItemContainer } from './ActivityCardItem.styles';
import { ActivityCardItemProps, ItemCardButtonsConfig } from './ActivityCardItem.types';
import { ItemCardButtons } from './ItemCardButtons';
import { ItemPicker } from './ItemPicker';

export const ActivityCardItem = ({
  activityItem,
  isBackVisible,
  isSubmitVisible,
  step,
  toNextStep,
  toPrevStep,
  isActive,
  onSubmit,
  'data-testid': dataTestid,
}: ActivityCardItemProps) => {
  const buttonConfig: ItemCardButtonsConfig = {
    isSkippable: activityItem.activityItem.config.skippableItem,
    isBackVisible: isBackVisible && !activityItem.activityItem.config.removeBackButton,
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
    <StyledCardItemContainer data-testid={`${dataTestid}-${activityItem.activityItem.responseType}`}>
      <CollapsedMdText
        text={getDictionaryText(activityItem.activityItem.question)}
        maxHeight={120}
        data-testid={`${dataTestid}-question`}
      />
      <ItemPicker activityItem={activityItem} isDisabled={!isActive} data-testid={`${dataTestid}-item`} />
      {isActive && (
        <ItemCardButtons
          step={step}
          config={buttonConfig}
          isSubmitVisible={isSubmitVisible}
          onNextButtonClick={onNextButtonClick}
          onBackButtonClick={onBackButtonClick}
          onSubmit={onSubmit}
          data-testid={`${dataTestid}-item-buttons`}
        />
      )}
    </StyledCardItemContainer>
  );
};
