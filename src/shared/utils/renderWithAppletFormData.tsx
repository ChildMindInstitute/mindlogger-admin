// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { mockedAppletFormData } from 'shared/mock';
import { ExtendedRenderOptions } from 'redux/store';

import { AppletFormValues } from 'modules/Builder/types';
import { renderWithProviders } from './renderWithProviders';

type FormComponentProps = {
  defaultValues?: AppletFormValues;
  children: ReactNode;
};
type RenderWithAppletFormData = {
  children: ReactNode;
  appletFormData?: AppletFormValues;
  options?: ExtendedRenderOptions;
};

const FormComponent = ({ defaultValues, children }: FormComponentProps) => {
  const methods = useForm<AppletFormValues>({
    defaultValues: defaultValues ?? mockedAppletFormData,
    mode: 'onChange',
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};

export const renderWithAppletFormData = ({
  children,
  appletFormData,
  options,
}: RenderWithAppletFormData) => {
  const form = <FormComponent defaultValues={appletFormData}>{children}</FormComponent>;

  return renderWithProviders(form, options ?? {});
};
