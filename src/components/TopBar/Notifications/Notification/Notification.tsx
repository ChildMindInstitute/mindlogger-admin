import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Svg } from 'components/Svg';
import { account } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import logoSrc from 'assets/images/logo.png';
import { variables } from 'styles/variables';
import { StyledLabelMedium } from 'styles/styledComponents/Typography';

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
  StyledMessage,
  StyledTitle,
  StyledTopSection,
  StyledBottomSection,
  StyledBtn,
} from './Notification.styles';
import { NotificationProps } from './Notification.types';

export const Notification = ({
  currentId,
  setCurrentId,
  accountId,
  alertId,
  label,
  title,
  message,
  imageSrc,
  timeAgo,
  viewed,
}: NotificationProps): JSX.Element => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const isActive = currentId === alertId;

  const handleNotificationClick = async () => {
    const { updateAlertStatus } = account.thunk;
    setCurrentId(alertId);
    const result = await dispatch(updateAlertStatus({ alertId }));

    if (updateAlertStatus.fulfilled.match(result)) {
      await dispatch(account.thunk.switchAccount({ accountId }));
    }
  };

  const handleToResponseDataClick = () => console.log('Take me to the response data click');

  return (
    <StyledNotification active={isActive} variant="text" onClick={handleNotificationClick}>
      <StyledTopSection>
        <StyledLeftSection>
          <StyledImageWrapper>
            {imageSrc && <StyledImage src={imageSrc} alt={label} />}
            <StyledLogo src={logoSrc} alt={label} />
          </StyledImageWrapper>
        </StyledLeftSection>
        <StyledInfo>
          <StyledLabelMedium
            fontWeight={isActive ? 'medium' : 'semiBold'}
            color={variables.palette.on_surface_variant}
          >
            {label}
          </StyledLabelMedium>
          <StyledTitle
            fontWeight={isActive ? 'medium' : 'semiBold'}
            color={
              isActive ? variables.palette.on_secondary_container : variables.palette.on_surface
            }
          >
            {title}
          </StyledTitle>
          <StyledMessage
            fontWeight={isActive ? 'regular' : 'medium'}
            color={
              isActive ? variables.palette.on_secondary_container : variables.palette.on_surface
            }
          >
            {message}
          </StyledMessage>
        </StyledInfo>
        <StyledRightSection>{!viewed ? <StyledInfoCircle /> : <Box />}</StyledRightSection>
      </StyledTopSection>
      <StyledBottomSection>
        {isActive && (
          <StyledBtn
            variant="contained"
            startIcon={<Svg width="16.5" height="16.5" id="data-outlined" />}
            onClick={handleToResponseDataClick}
          >
            {t('takeMeToTheResponseData')}
          </StyledBtn>
        )}
        <StyledTimeAgo
          fontWeight={isActive ? 'medium' : 'semiBold'}
          color={viewed ? variables.palette.on_surface_variant : variables.palette.semantic.error}
        >
          {timeAgo}
        </StyledTimeAgo>
      </StyledBottomSection>
    </StyledNotification>
  );
};
