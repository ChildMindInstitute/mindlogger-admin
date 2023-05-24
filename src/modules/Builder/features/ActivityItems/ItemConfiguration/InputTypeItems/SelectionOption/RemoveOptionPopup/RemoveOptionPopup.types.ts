import { ConditionalLogic } from 'shared/state';

export type RemoveOptionPopupProps = {
  name: string;
  conditions?: ConditionalLogic[];
  onClose: () => void;
  onSubmit: () => void;
};
