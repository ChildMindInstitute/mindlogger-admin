import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { ToggleButtonGroup, TimePicker } from 'components';
import theme from 'styles/theme';
import { StyledLabelLarge } from 'styles/styledComponents/Typography';
import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';

import { StyledNotification, StyledCol, StyledleftCol } from './Notification.styles';
import { StyledColInner, StyledNotificationWrapper } from '../NotificationsTab.styles';
import { notificationTimeToggles } from './Notification.const';
import { Header } from '../Header';
import { NotificationProps } from './Notification.types';
import { FormValues, NotificationType } from '../../ActivityForm.types';

export const Notification = ({ index, remove }: NotificationProps) => {
  const { t } = useTranslation('app');
  const { setValue } = useFormContext<FormValues>();
  const [activeType, setActivetype] = useState<string>(NotificationType.fixed);

  const handleRemoveNotification = () => {
    remove(index);
  };

  const updateTime = () => {
    setValue(`notifications.${index}`, {
      at: null,
      from: null,
      to: null,
    });
  };

  return (
    <StyledNotificationWrapper>
      <StyledLabelLarge sx={{ margin: theme.spacing(0, 0, 1.2, 1.1) }}>
        {t('notification')} {index + 1}
      </StyledLabelLarge>
      <StyledNotification>
        <Header onClickHandler={handleRemoveNotification} />
        <StyledFlexTopCenter>
          <StyledleftCol>
            <ToggleButtonGroup
              toggleButtons={notificationTimeToggles}
              activeButton={activeType}
              setActiveButton={setActivetype}
              customChange={updateTime}
            />
          </StyledleftCol>
          <StyledCol sx={{ marginLeft: theme.spacing(2.4) }}>
            {activeType === NotificationType.fixed ? (
              <StyledColInner>
                <TimePicker name={`notifications.${index}.at`} label={t('at')} />
              </StyledColInner>
            ) : (
              <>
                <StyledColInner>
                  <TimePicker name={`notifications.${index}.from`} label={t('from')} />
                </StyledColInner>
                <StyledColInner sx={{ marginLeft: theme.spacing(2.4) }}>
                  <TimePicker name={`notifications.${index}.to`} label={t('to')} />
                </StyledColInner>
              </>
            )}
          </StyledCol>
        </StyledFlexTopCenter>
      </StyledNotification>
    </StyledNotificationWrapper>
  );
};
