import { ReactNode } from 'react';
import { Trans } from 'react-i18next';
import { ButtonProps } from '@mui/material';

import { SubmitBtnColor } from 'shared/components/Modal';

export const getScreens = ({
  enterPasswordScreen,
  appletName,
  onFirstCancel,
  onFirstSubmit,
  onSecondCancel,
  onSecondSubmit,
}: {
  enterPasswordScreen: ReactNode;
  appletName: string;
  onFirstCancel: () => void;
  onFirstSubmit: () => void;
  onSecondCancel: () => void;
  onSecondSubmit: () => void;
}) => [
  {
    title: 'arbitraryWarning.title',
    btnText: 'arbitraryWarning.proceedAnyway',
    submitBtnVariant: 'text' as ButtonProps['variant'],
    hasLeftBtn: true,
    leftBtnText: 'arbitraryWarning.contactSupport',
    leftBtnVariant: 'contained' as ButtonProps['variant'],
    content: (
      <Trans i18nKey="arbitraryWarning.contentFirst">
        Your applet
        <strong>
          <>{{ appletName }}</>
        </strong>
        is currently connected to an arbitrary server for data storage. If you proceed with the
        ownership transfer without contacting us, your applet will
        <strong>lose its arbitrary server configurations</strong>, and all data it subsequently
        collects will be stored on MindLogger servers from this point forward. In order to transfer
        the ownership of the applet while
        <strong>retaining the arbitrary server configuration</strong>, please reach out to the
        MindLogger support team by clicking the button below.
      </Trans>
    ),
    onSubmit: onFirstSubmit,
    onLeftBtnSubmit: onFirstCancel,
  },
  {
    component: enterPasswordScreen,
    title: 'transferOwnership',
    btnText: 'transferOwnership',
    submitBtnColor: 'error' as SubmitBtnColor,
    hasLeftBtn: true,
    leftBtnText: 'back',
    leftBtnVariant: 'text' as ButtonProps['variant'],
    content: (
      <Trans i18nKey="arbitraryWarning.contentSecond">
        <strong>
          Again, proceeding with the ownership transfer will cause this applet to lose its arbitrary
          server configurations, and all data it subsequently collects will be stored on MindLogger
          servers from this point forward.
        </strong>
        To proceed with the ownership transfer for your applet
        <strong>{{ appletName }}</strong>
        and break its arbitrary server connections, please re-enter the password of your applet
        below.
      </Trans>
    ),
    onSubmit: onSecondSubmit,
    onLeftBtnSubmit: onSecondCancel,
  },
];
