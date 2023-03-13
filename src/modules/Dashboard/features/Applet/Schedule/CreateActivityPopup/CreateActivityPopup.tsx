import { RefObject, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal } from 'shared/components';

import { CreateActivityPopupProps } from './CreateActivityPopup.types';
import { ActivityForm, ActivityFormRef } from '../ActivityForm';
import { ConfirmScheduledAccessPopup } from '../ConfirmScheduledAccessPopup';
import { RemoveAllScheduledEventsPopup } from '../RemoveAllScheduledEventsPopup';

export const CreateActivityPopup = ({
  open,
  activityName,
  setCreateActivityPopupVisible,
}: CreateActivityPopupProps) => {
  const { t } = useTranslation('app');
  const activityFormRef = useRef() as RefObject<ActivityFormRef>;
  const [removeAllScheduledEventsPopupVisible, setRemoveAllScheduledEventsPopupVisible] =
    useState(false);
  const [confirmScheduledAcessPopupVisible, setConfirmScheduledAccessPopupVisible] =
    useState(false);

  const onClose = () => setCreateActivityPopupVisible(false);

  const onSubmit = () => {
    if (activityFormRef?.current) {
      activityFormRef.current.submitForm();
    }
  };

  const onConfirmScheduledAccessClose = () => {
    setConfirmScheduledAccessPopupVisible(false);
    setCreateActivityPopupVisible(true);
  };

  const onRemoveAllScheduledEventsClose = () => {
    setRemoveAllScheduledEventsPopupVisible(false);
    setCreateActivityPopupVisible(true);
  };

  return (
    <>
      {open && (
        <Modal
          open={open}
          onClose={onClose}
          onSubmit={onSubmit}
          title={t('createActivitySchedule')}
          buttonText={t('save')}
          width="67.1"
        >
          <ActivityForm
            ref={activityFormRef}
            submitCallback={onClose}
            setRemoveAllEventsPopupVisible={setRemoveAllScheduledEventsPopupVisible}
            setConfirmScheduledAccessPopupVisible={setConfirmScheduledAccessPopupVisible}
          />
        </Modal>
      )}
      {removeAllScheduledEventsPopupVisible && (
        <RemoveAllScheduledEventsPopup
          open={removeAllScheduledEventsPopupVisible}
          onClose={onRemoveAllScheduledEventsClose}
          onSubmit={() => setRemoveAllScheduledEventsPopupVisible(false)}
          activityName={activityName}
        />
      )}
      {confirmScheduledAcessPopupVisible && (
        <ConfirmScheduledAccessPopup
          open={confirmScheduledAcessPopupVisible}
          onClose={onConfirmScheduledAccessClose}
          onSubmit={() => setConfirmScheduledAccessPopupVisible(false)}
          activityName={activityName}
        />
      )}
    </>
  );
};
