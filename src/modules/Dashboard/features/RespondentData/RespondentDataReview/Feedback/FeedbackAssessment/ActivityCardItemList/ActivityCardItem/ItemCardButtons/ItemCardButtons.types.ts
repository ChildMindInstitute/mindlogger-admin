import { ItemCardButtonsConfig } from '../ActivityCardItem.types';

export type ItemCardButtonsProps = {
  step: number;
  config: ItemCardButtonsConfig;
  isSubmitVisible: boolean;
  onBackButtonClick?: () => void;
  onNextButtonClick?: () => void;
  onSubmit?: () => void;
};
