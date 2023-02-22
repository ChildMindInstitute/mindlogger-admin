import { useTranslation } from 'react-i18next';

import { useBreadcrumbs } from 'hooks';
import { Svg } from 'components';
import { Header, RightButtonType } from 'features/Library/Header';
import { Applet, AppletUiType } from 'features/Library/Applet';
import { StyledBody, StyledHeadlineLarge } from 'styles/styledComponents';
import theme from 'styles/theme';

import { ContentContainer, StyledAppletList, StyledAppletContainer } from './Cart.styles';
import { mockedCartApplets as applets } from './mocked';

export const Cart = () => {
  const { t } = useTranslation('app');

  useBreadcrumbs([
    {
      icon: <Svg id="cart-outlined" width="18" height="18" />,
      label: t('cart'),
    },
  ]);

  return (
    <StyledBody>
      <Header
        isBackButtonVisible
        handleSearch={(value) => {
          console.log(value);
        }}
        rightButtonType={RightButtonType.Builder}
        rightButtonCallback={() => console.log('add to builder')}
      />
      <ContentContainer>
        <StyledHeadlineLarge sx={{ marginBottom: theme.spacing(3.6) }}>
          {t('cart')}
        </StyledHeadlineLarge>
        <StyledAppletList>
          {applets.map((applet) => (
            <StyledAppletContainer key={applet.id}>
              <Applet uiType={AppletUiType.Cart} applet={applet} />
            </StyledAppletContainer>
          ))}
        </StyledAppletList>
      </ContentContainer>
    </StyledBody>
  );
};
