import { ActivityCardItem } from './ActivityCardItem';
import { ActivityCardItemListProps } from './ActivityCartItemList.types';

export const ActivityCardItemList = ({
  step,
  items,
  isBackVisible,
  isSubmitVisible,
  toNextStep,
  toPrevStep,
  onSubmit,
}: ActivityCardItemListProps) => (
  <>
    {items.map((item, index) => {
      const isActive = index === 0;

      return (
        <ActivityCardItem
          key={item.id}
          activityItem={item}
          isBackVisible={isBackVisible}
          isSubmitVisible={isSubmitVisible}
          step={step}
          toNextStep={toNextStep}
          toPrevStep={toPrevStep}
          isActive={isActive}
          onSubmit={onSubmit}
        />
      );
    })}
  </>
);
