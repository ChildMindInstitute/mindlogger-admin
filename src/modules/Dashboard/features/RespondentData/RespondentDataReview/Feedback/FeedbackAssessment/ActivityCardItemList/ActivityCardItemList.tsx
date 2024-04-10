import { ActivityCardItem } from './ActivityCardItem';
import { ActivityCardItemListProps } from './ActivityCartItemList.types';

export const ActivityCardItemList = ({
  step,
  activityItems,
  isBackVisible,
  isSubmitVisible,
  toNextStep,
  toPrevStep,
  onSubmit,
}: ActivityCardItemListProps) => {
  const dataTestid = 'respondents-summary-feedback-assessment';

  return (
    <>
      {activityItems.map((item, index) => {
        const isActive = index === step;

        return (
          <ActivityCardItem
            key={item.activityItem.id}
            activityItem={item}
            isBackVisible={isBackVisible}
            isSubmitVisible={isSubmitVisible}
            step={step}
            toNextStep={toNextStep}
            toPrevStep={toPrevStep}
            isActive={isActive}
            onSubmit={onSubmit}
            data-testid={`${dataTestid}-activity-${index}`}
          />
        );
      })}
    </>
  );
};
