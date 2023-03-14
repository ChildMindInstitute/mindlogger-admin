import { Controller } from 'react-hook-form';
import { Radio, RadioGroup, FormControlLabelProps } from '@mui/material';

import { Table, UiType } from 'shared/components';
import { AppletImage } from 'modules/Dashboard/features/Applets/Table/AppletImage';
import { RadioGroupController } from 'shared/components/FormComponents';
import { WorkspaceImage, WorkspaceUiType } from 'shared/features/SwitchWorkspace';
import { Workspace } from 'shared/features/SwitchWorkspace/SwitchWorkspace.types';
import {
  theme,
  variables,
  StyledFlexTopCenter,
  StyledLabelLarge,
  StyledBodyLarge,
} from 'shared/styles';
import { HeadCell } from 'shared/types/table';
import i18n from 'i18n';

import {
  AddToBuilderActions,
  AddToBuilderSteps,
  Applet,
  GetStep,
  Step,
  TableController,
} from './AddToBuilderPopup.types';
import { StyledTableFormControlLabel } from './AddtoBuilderPopup.styles';

const getHeadCell = ({ id, label }: { id: string; label: string }): HeadCell[] => [
  {
    id,
    label,
    enableSort: false,
  },
];

const getAccountsRows = (accounts: Workspace[]) =>
  accounts?.map(({ accountId, accountName, image }) => ({
    accountName: {
      content: () => (
        <StyledTableFormControlLabel
          value={accountId}
          control={<Radio />}
          labelPlacement="start"
          label={
            <StyledFlexTopCenter>
              <WorkspaceImage
                uiType={WorkspaceUiType.Table}
                image={image}
                workspaceName={accountName}
              />
              <StyledLabelLarge sx={{ marginLeft: theme.spacing(1.2) }}>
                {accountName}
              </StyledLabelLarge>
            </StyledFlexTopCenter>
          }
        />
      ),
      value: accountName,
    },
  }));

const getAppletsRows = (applets: Applet[]) =>
  applets?.map(({ id, appletName, image }) => ({
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
        />
      ),
      value: appletName,
    },
  }));

const getActions = (): Omit<FormControlLabelProps, 'control'>[] => {
  const { t } = i18n;

  return [
    {
      value: AddToBuilderActions.CreateNewApplet,
      label: (
        <>
          <StyledBodyLarge>{t('createNewApplet')}</StyledBodyLarge>
          <StyledLabelLarge
            sx={{ color: variables.palette.primary, marginTop: theme.spacing(0.4) }}
          >
            {t('createNewAppletHint')}
          </StyledLabelLarge>
        </>
      ),
    },
    {
      value: AddToBuilderActions.AddToExistingApplet,
      label: <StyledBodyLarge>{t('addToExistingApplet')}</StyledBodyLarge>,
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
}: TableController) => (
  <Controller
    name={name}
    defaultValue={defaultValue}
    control={control}
    render={({ field }) => (
      <RadioGroup {...field}>
        <Table
          maxHeight="32.4rem"
          columns={columns}
          rows={rows}
          orderBy={orderBy}
          uiType={UiType.Secondary}
        />
      </RadioGroup>
    )}
  />
);

export const getSteps = ({
  control,
  isSelectAccountVisible,
  accounts,
  applets,
  setStep,
  setAddToBuilderPopupVisible,
  handleAddToBuilder,
  handleContinue,
}: GetStep): Step[] => {
  const { t } = i18n;
  const options = getActions();

  return [
    {
      stepId: AddToBuilderSteps.SelectAccount,
      popupTitle: 'accountSelection',
      render: () =>
        getTableController({
          name: 'selectedAccount',
          control,
          columns: getHeadCell({
            id: 'accountName',
            label: t('workspaceName'),
          }),
          rows: getAccountsRows(accounts),
          orderBy: 'accountName',
        }),
      buttonText: 'confirm',
      hasSecondBtn: true,
      secondBtnText: 'cancel',
      onSecondBtnSubmit: () => setAddToBuilderPopupVisible(false),
      onSubmitStep: () => setStep(AddToBuilderSteps.AddToBuilderActions),
    },
    {
      stepId: AddToBuilderSteps.AddToBuilderActions,
      popupTitle: 'contentActions',
      render: () => (
        <RadioGroupController name="addToBuilderAction" control={control} options={options} />
      ),
      buttonText: 'continue',
      hasSecondBtn: true,
      secondBtnText: isSelectAccountVisible ? 'back' : 'cancel',
      onSecondBtnSubmit: () =>
        isSelectAccountVisible
          ? setStep(AddToBuilderSteps.SelectAccount)
          : setAddToBuilderPopupVisible(false),
      onSubmitStep: () => handleAddToBuilder(),
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
      onSubmitStep: () => handleContinue(),
    },
  ];
};
