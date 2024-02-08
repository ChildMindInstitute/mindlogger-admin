import i18n from 'i18n';

const { t } = i18n;

export const getButtonLabel = (buttonsQuantity: number, buttonIndex: number) => {
  if (buttonsQuantity === 1) {
    return t('flankerButtons.buttonName');
  }

  return buttonIndex === 0 ? t('flankerButtons.leftButtonName') : t('flankerButtons.rightButtonName');
};
