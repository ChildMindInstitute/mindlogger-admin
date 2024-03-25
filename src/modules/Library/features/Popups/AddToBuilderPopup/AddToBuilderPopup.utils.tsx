import { Controller } from 'react-hook-form';
import { FormControlLabelProps, Radio, RadioGroup } from '@mui/material';

import { AppletImage, UiType } from 'shared/components';
import { RadioGroupController } from 'shared/components/FormComponents';
import { WorkspaceImage, WorkspaceUiType } from 'shared/features/SwitchWorkspace';
import {
  StyledBodyLarge,
  StyledErrorText,
  StyledFlexTopCenter,
  StyledLabelLarge,
  StyledLinearProgress,
  theme,
  variables,
} from 'shared/styles';
import { HeadCell } from 'shared/types/table';
import i18n from 'i18n';
import { Workspace } from 'shared/state';
import { Roles } from 'shared/consts';
import { DashboardAppletType, Applet as FullApplet } from 'api';
import { isManagerOrOwnerOrEditor } from 'shared/utils';

import {
  AddToBuilderActions,
  AddToBuilderSteps,
  Applet,
  GetStep,
  Step,
  TableController,
} from './AddToBuilderPopup.types';
import { StyledTable, StyledTableFormControlLabel } from './AddToBuilderPopup.styles';

const getHeadCell = ({ id, label }: { id: string; label: string }): HeadCell[] => [
  {
    id,
    label,
    enableSort: false,
  },
];

const getWorkspacesRows = (workspaces: Workspace[]) =>
  workspaces?.map(({ ownerId, workspaceName, image }, index) => ({
    workspaceName: {
      content: () => (
        <StyledTableFormControlLabel
          value={ownerId}
          control={<Radio />}
          labelPlacement="start"
          label={
            <StyledFlexTopCenter>
              <WorkspaceImage
                uiType={WorkspaceUiType.Table}
                image={image}
                workspaceName={workspaceName}
              />
              <StyledLabelLarge sx={{ marginLeft: theme.spacing(1.2) }}>
                {workspaceName}
              </StyledLabelLarge>
            </StyledFlexTopCenter>
          }
          data-testid={`library-cart-add-to-builder-popup-select-workspaces-${index}`}
        />
      ),
      value: workspaceName,
    },
  }));

const getAppletsRows = (applets: Applet[]) =>
  applets?.map(({ id, appletName, image }, index) => ({
    appletName: {
      content: () => (
        <StyledTableFormControlLabel
          value={id}
          control={<Radio />}
          labelPlacement="start"
          label={
            <StyledFlexTopCenter>
              <AppletImage image={image} appletName={appletName} />
              <StyledLabelLarge sx={{ marginLeft: theme.spacing(1.2) }}>
                {appletName}
              </StyledLabelLarge>
            </StyledFlexTopCenter>
          }
          data-testid={`library-cart-add-to-builder-popup-select-applet-${index}`}
        />
      ),
      value: appletName,
    },
  }));

const getActions = (applets: Applet[]): Omit<FormControlLabelProps, 'control'>[] => {
  const { t } = i18n;

  return [
    {
      value: AddToBuilderActions.CreateNewApplet,
      label: (
        <>
          <StyledBodyLarge>{t('createNewApplet')}</StyledBodyLarge>
          <StyledLabelLarge
            className="option-hint"
            sx={{ color: variables.palette.primary, marginTop: theme.spacing(0.4) }}
          >
            {t('createNewAppletHint')}
          </StyledLabelLarge>
        </>
      ),
    },
    {
      value: AddToBuilderActions.AddToExistingApplet,
      label: (
        <>
          <StyledBodyLarge>{t('addToExistingApplet')}</StyledBodyLarge>
          <StyledLabelLarge
            className="option-hint"
            sx={{ color: variables.palette.primary, marginTop: theme.spacing(0.4) }}
          >
            {t('exitingAppletHint')}
          </StyledLabelLarge>
        </>
      ),
      disabled: !applets.length,
    },
  ];
};

const getTableController = ({
  name,
  defaultValue = '',
  control,
  columns,
  rows,
  orderBy,
  dataTestid,
}: TableController) => (
  <Controller
    name={name}
    defaultValue={defaultValue}
    control={control}
    render={({ field, fieldState: { error } }) => (
      <>
        <RadioGroup {...field}>
          <StyledTable
            data-testid={dataTestid}
            className={error && 'error'}
            maxHeight="32.4rem"
            columns={columns}
            rows={rows}
            orderBy={orderBy}
            uiType={UiType.Secondary}
            tableHeadBg={variables.modalBackground}
          />
        </RadioGroup>
        {error && <StyledErrorText marginTop={1.2}>{error?.message}</StyledErrorText>}
      </>
    )}
  />
);

export const getSteps = ({
  control,
  isWorkspacesModalVisible,
  hasAppletAccessError,
  workspaces,
  applets,
  setStep,
  setAddToBuilderPopupVisible,
  handleNext,
  handleAddToNewApplet,
  handleAddToExistingApplet,
  errorCallback,
}: GetStep): Step[] => {
  const { t } = i18n;
  const options = getActions(applets);

  return [
    {
      stepId: AddToBuilderSteps.LoadingWorkspaces,
      popupTitle: 'workspacesLoading',
      render: () => <StyledLinearProgress />,
      buttonText: 'cancel',
      onSubmitStep: () => setAddToBuilderPopupVisible(false),
    },
    {
      stepId: AddToBuilderSteps.SelectWorkspace,
      popupTitle: 'workspaceSelection',
      render: () =>
        getTableController({
          name: 'selectedWorkspace',
          control,
          columns: getHeadCell({
            id: 'workspaceName',
            label: t('workspaceName'),
          }),
          rows: getWorkspacesRows(workspaces),
          orderBy: 'workspaceName',
          dataTestid: 'select-workspace-table',
        }),
      buttonText: 'confirm',
      hasSecondBtn: true,
      secondBtnText: 'cancel',
      onSecondBtnSubmit: () => setAddToBuilderPopupVisible(false),
      onSubmitStep: () => handleNext(AddToBuilderSteps.AddToBuilderActions),
    },
    {
      stepId: AddToBuilderSteps.AddToBuilderActions,
      popupTitle: 'contentActions',
      render: () => (
        <RadioGroupController
          name="addToBuilderAction"
          control={control}
          options={options}
          data-testid="library-cart-add-to-builder-popup-select-action"
        />
      ),
      buttonText: 'continue',
      hasSecondBtn: true,
      secondBtnText: isWorkspacesModalVisible ? 'back' : 'cancel',
      onSecondBtnSubmit: () =>
        isWorkspacesModalVisible
          ? setStep(AddToBuilderSteps.SelectWorkspace)
          : setAddToBuilderPopupVisible(false),
      onSubmitStep: () => handleAddToNewApplet(),
    },
    {
      stepId: AddToBuilderSteps.SelectApplet,
      popupTitle: 'selectApplet',
      render: () => (
        <>
          <StyledBodyLarge
            sx={{ color: variables.palette.on_surface, marginBottom: theme.spacing(2.4) }}
          >
            {t('selectAppletDescription')}
          </StyledBodyLarge>
          {getTableController({
            name: 'selectedApplet',
            control,
            columns: getHeadCell({
              id: 'appletName',
              label: t('appletName'),
            }),
            rows: getAppletsRows(applets),
            orderBy: 'appletName',
          })}
        </>
      ),
      buttonText: 'confirm',
      hasSecondBtn: true,
      secondBtnText: 'back',
      onSecondBtnSubmit: () => setStep(AddToBuilderSteps.AddToBuilderActions),
      onSubmitStep: () => handleAddToExistingApplet(),
    },
    {
      stepId: AddToBuilderSteps.Error,
      popupTitle: 'addToBuilder',
      render: () => (
        <StyledBodyLarge color={variables.palette.semantic.error}>
          {t('addToBuilderError')}
        </StyledBodyLarge>
      ),
      buttonText: 'retry',
      hasSecondBtn: true,
      secondBtnText: 'cancel',
      onSecondBtnSubmit: () => setAddToBuilderPopupVisible(false),
      onSubmitStep: () => errorCallback(),
    },
    {
      stepId: AddToBuilderSteps.AccessError,
      popupTitle: 'addToBuilderAccessError',
      render: () => (
        <StyledBodyLarge color={variables.palette.semantic.error}>
          {t(
            hasAppletAccessError
              ? 'addToBuilderAppletAccessError'
              : 'addToBuilderWorkspaceAccessError',
          )}
        </StyledBodyLarge>
      ),
      buttonText: 'ok',
      onSubmitStep: () => setAddToBuilderPopupVisible(false),
    },
  ];
};

export const getArrayFromApplets = (applets: FullApplet[]) =>
  applets.reduce((acc: Applet[], { id, type, displayName, image, role }) => {
    if (type === DashboardAppletType.Applet && isManagerOrOwnerOrEditor(role as Roles)) {
      acc.push({ id, appletName: displayName, image });
    }

    return acc;
  }, []);
