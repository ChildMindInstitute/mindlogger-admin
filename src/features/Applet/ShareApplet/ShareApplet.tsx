import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  checkAppletNameInLibraryApi,
  publishAppletToLibraryApi,
  getAppletLibraryUrlApi,
  updateAppletSearchTermsApi,
} from 'api';
import { folders } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { Spinner } from 'components/Spinner';
import { InputController, CheckboxController, TagsController } from 'components/FormComponents';
import { StyledErrorText } from 'styles/styledComponents/ErrorText';
import { StyledBodyMedium } from 'styles/styledComponents/Typography';
import { getErrorMessage } from 'utils/errors';

import { shareAppletDefaultValues } from './ShareApplet.const';
import { ShareAppletSchema } from './ShareApplet.schema';
import { ShareAppletData, ShareAppletProps } from './ShareApplet.types';
import { StyledInputWrapper } from './ShareApplet.styles';
import { SuccessShared } from './SuccessShared';

export const ShareApplet = ({
  applet,
  onAppletShared,
  onDisableSubmit,
  isSubmitted,
  showSuccess = true,
}: ShareAppletProps) => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();

  const [appletShared, setAppletShared] = useState(false);
  const [showNameTakenError, setShowNameTakenError] = useState(false);
  const [libraryUrl, setLibraryUrl] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { handleSubmit, control, watch, setValue, getValues } = useForm<ShareAppletData>({
    resolver: yupResolver(ShareAppletSchema()),
    defaultValues: { ...shareAppletDefaultValues, appletName: applet?.name },
  });

  const checked = watch('checked');

  useEffect(() => {
    onDisableSubmit(!checked);
  }, [checked]);

  const handleShareApplet = useCallback(async () => {
    if (applet) {
      try {
        const checkResult = await checkAppletNameInLibraryApi({
          appletId: applet.id || '',
          appletName: getValues().appletName || '',
        });
        setShowNameTakenError(!checkResult?.data);

        if (checkResult?.data) {
          setIsLoading(true);
          await publishAppletToLibraryApi({
            appletId: applet.id || '',
          });
          await updateAppletSearchTermsApi({
            appletId: applet.id || '',
            params: { keywords: JSON.stringify(keywords) },
          });
          const libraryUrlResult = await getAppletLibraryUrlApi({
            appletId: applet.id || '',
          });

          setLibraryUrl(libraryUrlResult?.data as string);
          setIsLoading(false);
          onAppletShared && onAppletShared({ keywords, libraryUrl: libraryUrlResult?.data });
          setAppletShared(true);

          dispatch(
            folders.actions.updateAppletData({
              appletId: applet.id || '',
              published: true,
              appletName: getValues().appletName,
            }),
          );
        }
      } catch (e) {
        setErrorMessage(getErrorMessage(e));
        setIsLoading(false);
      }
    }
  }, [keywords]);

  useEffect(() => {
    if (isSubmitted && !appletShared) {
      handleSubmit(handleShareApplet)();
    }
  }, [isSubmitted, appletShared]);

  const handleAddKeyword = (value: string) => {
    if (value.length) {
      setValue('keyword', '');
      setKeywords((prevState) => {
        if (prevState?.some((item) => item === value)) {
          return prevState;
        }
        const res = prevState?.concat(value);
        setValue('keywords', res);

        return res;
      });
    }
  };

  const handleRemoveKeyword = (index: number) => {
    setKeywords((prevState) => {
      const res = prevState?.filter((_, i) => i !== index);
      setValue('keywords', res);

      return res;
    });
  };

  let modalComponent: JSX.Element | null = (
    <>
      {isLoading && <Spinner />}
      <form>
        <StyledInputWrapper>
          <InputController
            fullWidth
            name="appletName"
            error={showNameTakenError}
            control={control}
            label={t('appletName')}
            required
            value={applet?.name}
          />
          {showNameTakenError && (
            <StyledErrorText
              marginTop={0.5}
              dangerouslySetInnerHTML={{ __html: t('appletNameAlreadyTaken') }}
            />
          )}
        </StyledInputWrapper>
        <StyledInputWrapper>
          <TagsController
            fullWidth
            name="keyword"
            control={control}
            label={t('keywords')}
            tags={keywords}
            onAddTagClick={handleAddKeyword}
            onRemoveTagClick={handleRemoveKeyword}
          />
        </StyledInputWrapper>
        <StyledInputWrapper>
          <CheckboxController
            name="checked"
            control={control}
            label={<StyledBodyMedium>{t('agreementAppletAvailability') || ''}</StyledBodyMedium>}
          />
        </StyledInputWrapper>
        {errorMessage && (
          <StyledInputWrapper>
            <StyledErrorText marginTop={0}>{errorMessage}</StyledErrorText>
          </StyledInputWrapper>
        )}
      </form>
    </>
  );

  if (appletShared && showSuccess && applet) {
    modalComponent = (
      <SuccessShared
        title={getValues().appletName || applet.name || ''}
        text={applet.description || ''}
        keywords={keywords}
        // TODO: Implement applet activities quantity
        // activitiesQuantity={8}
        appletLink={libraryUrl}
        img={applet.image || ''}
      />
    );
  }

  return modalComponent;
};
