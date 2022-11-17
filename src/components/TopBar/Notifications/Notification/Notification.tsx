import { Box } from '@mui/material';

import { account } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import logoSrc from 'assets/images/logo.png';
import { variables } from 'styles/variables';
import {
  StyledLabelMedium,
  StyledTitleMedium,
  StyledBodyMedium,
} from 'styles/styledComponents/Typography';

import {
  StyledNotification,
  StyledLeftSection,
  StyledImageWrapper,
  StyledImage,
  StyledInfo,
  StyledRightSection,
  StyledInfoCircle,
  StyledTimeAgo,
  StyledLogo,
} from './Notification.styles';
import { NotificationProps } from './Notification.types';

export const Notification = ({
  accountId,
  alertId,
  label,
  title,
  message,
  imageSrc,
  timeAgo,
  viewed,
}: NotificationProps): JSX.Element => {
  const dispatch = useAppDispatch();

  const handleNotificationClick = async () => {
    const { updateAlertStatus } = account.thunk;
    const result = await dispatch(updateAlertStatus({ alertId }));

    if (updateAlertStatus.fulfilled.match(result)) {
      await dispatch(account.thunk.switchAccount({ accountId }));
      // TODO: Add an alert popup with a direction to the response data when the design is ready
    }
  };

  return (
    <StyledNotification variant="text" onClick={handleNotificationClick}>
      <StyledLeftSection>
        <StyledImageWrapper>
          {imageSrc && <StyledImage src={imageSrc} alt={label} />}
          <StyledLogo src={logoSrc} alt={label} />
        </StyledImageWrapper>
      </StyledLeftSection>
      <StyledInfo>
        <StyledLabelMedium fontWeight="semiBold" color={variables.palette.on_surface_variant}>
          {label}
        </StyledLabelMedium>
        <StyledTitleMedium fontWeight="semiBold" color={variables.palette.on_surface}>
          {title}
        </StyledTitleMedium>
        <StyledBodyMedium color={variables.palette.on_surface_variant}>{message}</StyledBodyMedium>
      </StyledInfo>
      <StyledRightSection>
        {!viewed ? <StyledInfoCircle /> : <Box />}
        <StyledTimeAgo fontWeight="semiBold" color={variables.palette.on_surface_variant}>
          {timeAgo}
        </StyledTimeAgo>
      </StyledRightSection>
    </StyledNotification>
  );
};
