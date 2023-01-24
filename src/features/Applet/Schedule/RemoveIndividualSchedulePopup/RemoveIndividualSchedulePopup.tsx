import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Modal } from 'components';
import { StyledModalWrapper } from 'styles/styledComponents/Modal';
import { StyledTitleMedium } from 'styles/styledComponents/Typography';
import theme from 'styles/theme';

import { RemoveIndividualSchedulePopupProps } from './RemoveIndividualSchedulePopup.types';

export const RemoveIndividualSchedulePopup = ({
  open,
  onClose,
  name,
  isEmpty,
}: RemoveIndividualSchedulePopupProps) => {
  const { t } = useTranslation();
  const [isRemoved, setIsRemoved] = useState(false);

  const onSubmit = () => {
    if (isRemoved) {
      onClose();
    } else {
      setIsRemoved(true);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t(isRemoved ? 'individualScheduleRemoved' : 'removeIndividualSchedule')}
      onSubmit={onSubmit}
      buttonText={t(isRemoved ? 'ok' : 'remove')}
      hasSecondBtn={!isRemoved}
      secondBtnText={t('cancel')}
      width="66"
    >
      <StyledModalWrapper>
        {isRemoved ? (
          <StyledTitleMedium>
            <Trans i18nKey="removeIndividualScheduleSuccess">
              Respondent
              <strong>
                <>{{ name }}</>
              </strong>
              is now using the
              <strong>default schedule</strong>. You may add an individual schedule for this
              respondent again any time.
            </Trans>
          </StyledTitleMedium>
        ) : (
          <>
            {isEmpty ? (
              <StyledTitleMedium>
                <Trans i18nkey="confirmRemoveIndividualSchedule">
                  <strong>
                    <>{{ name }}</>
                  </strong>
                  ’s individual schedule will be removed, and the respondent will use the
                  <strong> default schedule </strong>
                  instead. Are you sure you want to continue?
                </Trans>
              </StyledTitleMedium>
            ) : (
              <Trans i18nkey="confirmRemoveEmptyIndividualSchedule">
                <StyledTitleMedium>
                  You are about to remove
                  <strong>
                    <> {{ name }}</>
                  </strong>
                  ’s individual schedule and move them to group of respondents using the
                  <strong> default schedule</strong>.
                </StyledTitleMedium>
                <StyledTitleMedium sx={{ marginTop: theme.spacing(2.4) }}>
                  All scheduled activities and their notifications will be lost. Are you sure you
                  want to continue?
                </StyledTitleMedium>
              </Trans>
            )}
          </>
        )}
      </StyledModalWrapper>
    </Modal>
  );
};
