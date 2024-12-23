import { RefObject, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Modal, Spinner, SpinnerUiType } from 'shared/components';
import { Mixpanel, MixpanelCalendarEvent, MixpanelProps } from 'shared/utils/mixpanel';
import { AnalyticsCalendarPrefix } from 'shared/consts';

import { EventForm, EventFormRef } from '../EventForm';
import { ConfirmScheduledAccessPopup } from '../ConfirmScheduledAccessPopup';
import { RemoveAllScheduledEventsPopup } from '../RemoveAllScheduledEventsPopup';
import { CreateEventPopupProps } from './CreateEventPopup.types';

export const CreateEventPopup = ({
  open,
  setCreateEventPopupVisible,
  defaultStartDate,
  'data-testid': dataTestid,
  userId,
}: CreateEventPopupProps) => {
  const { t } = useTranslation('app');
  const eventFormRef = useRef() as RefObject<EventFormRef>;
  const { appletId } = useParams();
  const [currentActivityName, setCurrentActivityName] = useState('');
  const [removeAllScheduledPopupVisible, setRemoveAllScheduledPopupVisible] = useState(false);
  const [removeAlwaysAvailablePopupVisible, setRemoveAlwaysAvailablePopupVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleCreateEventClose = () => setCreateEventPopupVisible(false);

  const isIndividualCalendar = !!userId;
  const analyticsPrefix = isIndividualCalendar
    ? AnalyticsCalendarPrefix.IndividualCalendar
    : AnalyticsCalendarPrefix.GeneralCalendar;

  const onCreateActivitySubmit = () => {
    if (eventFormRef?.current) {
      eventFormRef.current.submitForm();
    }

    Mixpanel.track({
      action: MixpanelCalendarEvent[analyticsPrefix].ScheduleSaveClick,
      [MixpanelProps.AppletId]: appletId,
    });
  };

  const handleRemoveAlwaysAvailableClose = () => {
    setRemoveAlwaysAvailablePopupVisible(false);
  };

  const handleRemoveAllScheduledClose = () => {
    setRemoveAllScheduledPopupVisible(false);
  };

  const handleRemoveAllScheduledSubmit = async () => {
    if (eventFormRef?.current) {
      await eventFormRef.current.processEvent();
      setRemoveAllScheduledPopupVisible(false);
      handleCreateEventClose();
    }
  };

  const handleRemoveAlwaysAvailableSubmit = async () => {
    if (eventFormRef?.current) {
      await eventFormRef.current.processEvent();
      setRemoveAlwaysAvailablePopupVisible(false);
      handleCreateEventClose();
    }
  };

  const handleFormIsLoading = (isLoading: boolean) => {
    setIsLoading(isLoading);
  };

  return (
    <>
      {open && (
        <Modal
          open={open}
          onClose={handleCreateEventClose}
          onSubmit={onCreateActivitySubmit}
          disabledSubmit={isLoading}
          title={t('createActivitySchedule')}
          buttonText={t('save')}
          width="67.1"
          height="81.2rem"
          sxProps={{
            opacity: removeAllScheduledPopupVisible || removeAlwaysAvailablePopupVisible ? 0 : 1,
          }}
          data-testid={dataTestid}
        >
          <>
            {isLoading && !removeAllScheduledPopupVisible && !removeAlwaysAvailablePopupVisible && (
              <Spinner uiType={SpinnerUiType.Secondary} noBackground />
            )}
            <EventForm
              ref={eventFormRef}
              submitCallback={handleCreateEventClose}
              setRemoveAllScheduledPopupVisible={setRemoveAllScheduledPopupVisible}
              setRemoveAlwaysAvailablePopupVisible={setRemoveAlwaysAvailablePopupVisible}
              setActivityName={setCurrentActivityName}
              defaultStartDate={defaultStartDate}
              onFormIsLoading={handleFormIsLoading}
              data-testid={`${dataTestid}-form`}
              userId={userId}
            />
          </>
        </Modal>
      )}
      {removeAllScheduledPopupVisible && (
        <RemoveAllScheduledEventsPopup
          open={removeAllScheduledPopupVisible}
          onClose={handleRemoveAllScheduledClose}
          onSubmit={handleRemoveAllScheduledSubmit}
          activityName={currentActivityName}
          isLoading={isLoading}
          data-testid={`${dataTestid}-remove-all-scheduled-events-popup`}
        />
      )}
      {removeAlwaysAvailablePopupVisible && (
        <ConfirmScheduledAccessPopup
          open={removeAlwaysAvailablePopupVisible}
          onClose={handleRemoveAlwaysAvailableClose}
          onSubmit={handleRemoveAlwaysAvailableSubmit}
          activityName={currentActivityName}
          isLoading={isLoading}
          data-testid={`${dataTestid}-confirm-scheduled-access-popup`}
        />
      )}
    </>
  );
};
