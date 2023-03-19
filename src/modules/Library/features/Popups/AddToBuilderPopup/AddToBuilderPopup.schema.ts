import i18n from 'i18n';
import { object, string } from 'yup';

import {
  AddToBuilderActions,
  AddToBuilderPopupSchemaType,
  AddToBuilderSteps,
} from './AddToBuilderPopup.types';

export const addToBuilderPopupSchema = (): AddToBuilderPopupSchemaType => {
  const { t } = i18n;
  const workspaceRequired = t('workspaceRequired');
  const appletRequired = t('appletRequired');

  return {
    [AddToBuilderSteps.SelectWorkspace]: object({
      selectedWorkspace: string().required(workspaceRequired),
    }),
    [AddToBuilderSteps.AddToBuilderActions]: object({
      addToBuilderAction: string().required(),
    }),
    [AddToBuilderSteps.SelectApplet]: object({
      selectedApplet: string().test(
        'check_addToBuilderAction',
        appletRequired,
        (value, testContext) => {
          const isAddToExistingAppletSelected =
            testContext.parent?.addToBuilderAction === AddToBuilderActions.AddToExistingApplet;

          return !!value || isAddToExistingAppletSelected;
        },
      ),
    }),
    [AddToBuilderSteps.Error]: object(),
  };
};
