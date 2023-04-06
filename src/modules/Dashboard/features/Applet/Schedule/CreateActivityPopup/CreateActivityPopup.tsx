import { RefObject, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal } from 'shared/components';

import { CreateActivityPopupProps } from './CreateActivityPopup.types';
import { ActivityForm, ActivityFormRef } from '../ActivityForm';
import { ConfirmScheduledAccessPopup } from '../ConfirmScheduledAccessPopup';
import { RemoveAllScheduledEventsPopup } from '../RemoveAllScheduledEventsPopup';

export const CreateActivityPopup = ({
  open,
  setCreateActivityPopupVisible,
  defaultStartDate,
}: CreateActivityPopupProps) => {
  const { t } = useTranslation('app');
  const activityFormRef = useRef() as RefObject<ActivityFormRef>;
  const [currentActivityName, setCurrentActivityName] = useState('');
  const [removeAllScheduledPopupVisible, setRemoveAllScheduledPopupVisible] = useState(false);
  const [removeAlwaysAvailablePopupVisible, setRemoveAlwaysAvailablePopupVisible] = useState(false);

  const handleCreateActivityClose = () => setCreateActivityPopupVisible(false);

  const onCreateActivitySubmit = () => {
    if (activityFormRef?.current) {
      activityFormRef.current.submitForm();
    }
  };

  const onRemoveAlwaysAvailableClose = () => {
    setRemoveAlwaysAvailablePopupVisible(false);
  };

  const onRemoveAllScheduledClose = () => {
    setRemoveAllScheduledPopupVisible(false);
  };

  const onRemoveAllScheduledSubmit = async () => {
    if (activityFormRef?.current) {
      await activityFormRef.current.createEvent();
      setRemoveAllScheduledPopupVisible(false);
      handleCreateActivityClose();
    }
  };

  const onRemoveAlwaysAvailableSubmit = async () => {
    if (activityFormRef?.current) {
      await activityFormRef.current.createEvent();
      setRemoveAlwaysAvailablePopupVisible(false);
      handleCreateActivityClose();
    }
  };

  return (
    <>
      {open && (
        <Modal
          open={open}
          onClose={handleCreateActivityClose}
          onSubmit={onCreateActivitySubmit}
          title={t('createActivitySchedule')}
          buttonText={t('save')}
          width="67.1"
          height="81.2rem"
          sxProps={{
            opacity: removeAllScheduledPopupVisible || removeAlwaysAvailablePopupVisible ? 0 : 1,
          }}
        >
          <ActivityForm
            ref={activityFormRef}
            submitCallback={handleCreateActivityClose}
            setRemoveAllScheduledPopupVisible={setRemoveAllScheduledPopupVisible}
            setRemoveAlwaysAvailablePopupVisible={setRemoveAlwaysAvailablePopupVisible}
            setActivityName={setCurrentActivityName}
            defaultStartDate={defaultStartDate}
          />
        </Modal>
      )}
      {removeAllScheduledPopupVisible && (
        <RemoveAllScheduledEventsPopup
          open={removeAllScheduledPopupVisible}
          onClose={onRemoveAllScheduledClose}
          onSubmit={onRemoveAllScheduledSubmit}
          activityName={currentActivityName}
        />
      )}
      {removeAlwaysAvailablePopupVisible && (
        <ConfirmScheduledAccessPopup
          open={removeAlwaysAvailablePopupVisible}
          onClose={onRemoveAlwaysAvailableClose}
          onSubmit={onRemoveAlwaysAvailableSubmit}
          activityName={currentActivityName}
        />
      )}
    </>
  );
};
