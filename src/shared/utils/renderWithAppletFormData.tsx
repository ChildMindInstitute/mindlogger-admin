// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { ReactNode, useImperativeHandle, forwardRef } from 'react';

import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { mockedAppletFormData } from 'shared/mock';
import { ExtendedRenderOptions } from 'redux/store';
import { AppletFormValues } from 'modules/Builder/types';
import { AppletSchema } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.schema';

import { renderWithProviders } from './renderWithProviders';

type FormComponentProps = {
  defaultValues?: AppletFormValues;
  children: ReactNode;
};
type RenderWithAppletFormData = {
  children: ReactNode;
  appletFormData?: AppletFormValues;
  options?: ExtendedRenderOptions;
  formRef?: RefObject<ReturnType<typeof useForm>>;
};

const FormComponent = forwardRef(({ defaultValues, children }: FormComponentProps, ref) => {
  const methods = useForm<AppletFormValues>({
    defaultValues: defaultValues ?? mockedAppletFormData,
    mode: 'onChange',
    resolver: yupResolver(AppletSchema()),
  });

  useImperativeHandle(ref, () => methods, [ref]);

  return <FormProvider {...methods}>{children}</FormProvider>;
});

export const renderWithAppletFormData = ({
  children,
  appletFormData,
  options,
  formRef,
}: RenderWithAppletFormData) => {
  const form = (
    <FormComponent defaultValues={appletFormData} ref={formRef}>
      {children}
    </FormComponent>
  );

  return renderWithProviders(form, options ?? {});
};
