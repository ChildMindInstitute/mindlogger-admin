import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { deleteAppletPublicLinkApi } from 'api';
import { getErrorMessage } from 'utils/getErrorMessage';
import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';
import { StyledBodyMedium } from 'styles/styledComponents/Typography';
import { Svg } from 'components/Svg';

import { StyledButton, StyledInput } from './LinkForm.styles';
import { LinkGeneratorProps } from '../LinkGenerator.types';
import { formatLink } from '../LinkGenerator.utils';

export const LinkForm = ({ inviteLink, setInviteLink }: LinkGeneratorProps) => {
  const { id } = useParams();
  const { t } = useTranslation('app');
  const publicLink = formatLink(inviteLink?.inviteId) || '';

  const deleteAppletPublicLink = async () => {
    try {
      if (id) {
        await deleteAppletPublicLinkApi({ appletId: id });
        setInviteLink(null);
      }
    } catch (e) {
      getErrorMessage(e);
    }
  };

  const copyPublicLink = () => {
    navigator.clipboard.writeText(publicLink);
  };

  return (
    <>
      <StyledBodyMedium>
        {inviteLink?.requireLogin ? t('shareWithLogin') : t('shareWithNoLogin')}
      </StyledBodyMedium>
      <StyledFlexTopCenter>
        <StyledInput
          label=""
          defaultValue={publicLink}
          InputProps={{
            readOnly: true,
          }}
          data-testid="generated-input"
        />
        <StyledButton variant="outlined" onClick={copyPublicLink}>
          <Svg id="duplicate" />
        </StyledButton>
      </StyledFlexTopCenter>
      <StyledFlexTopCenter>
        <StyledButton variant="outlined" onClick={deleteAppletPublicLink}>
          {t('deleteInviteLink')}
        </StyledButton>
        <StyledBodyMedium>{t('deleteLinkToNoAllow')}</StyledBodyMedium>
      </StyledFlexTopCenter>
    </>
  );
};
