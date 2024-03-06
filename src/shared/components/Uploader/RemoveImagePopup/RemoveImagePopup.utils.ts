import { ScreenParams } from './RemoveImagePopup.types';

export const getScreens = ({ onClose, onRemove, setStep }: ScreenParams) => [
  {
    buttonText: 'remove',
    hasSecondBtn: true,
    content: 'removeImageDescription',
    onSubmit: () => {
      onRemove();
      setStep(1);
    },
  },
  {
    buttonText: 'ok',
    hasSecondBtn: false,
    content: 'removeImageSuccess',
    onSubmit: onClose,
  },
];
