import { useTranslation, Trans } from 'react-i18next';

import { useCustomFormContext } from 'modules/Builder/hooks';
import { Modal } from 'shared/components';
import { StyledModalWrapper, StyledBodyLarge, theme } from 'shared/styles';
import { ConditionalPanel } from 'modules/Builder/features/ActivityItems/ConditionalPanel';

import { RemoveOptionPopupProps } from './RemoveOptionPopup.types';

export const RemoveOptionPopup = ({
  name,
  conditions,
  onClose,
  onSubmit,
  'data-testid': dataTestid,
}: RemoveOptionPopupProps) => {
  const { t } = useTranslation('app');
  const { watch } = useCustomFormContext();

  const option = watch(name);

  return (
    <Modal
      open
      onClose={onClose}
      onSubmit={onSubmit}
      onSecondBtnSubmit={onClose}
      title={t('deleteOption')}
      buttonText={t('delete')}
      secondBtnText={t('cancel')}
      hasSecondBtn
      submitBtnColor="error"
      data-testid={dataTestid}
    >
      <StyledModalWrapper>
        <StyledBodyLarge sx={{ mb: theme.spacing(2.4) }}>
          <Trans i18nKey="deleteOptionDescription">
            Are you sure you want to delete Option
            <strong>
              <>{{ name: option?.text }}</>
            </strong>
            ? It will also remove the Conditional(s) below
          </Trans>
        </StyledBodyLarge>
        {conditions?.map((conditionalLogic) => (
          <ConditionalPanel
            key={`condition-panel-${conditionalLogic.key}`}
            condition={conditionalLogic}
          />
        ))}
      </StyledModalWrapper>
    </Modal>
  );
};
