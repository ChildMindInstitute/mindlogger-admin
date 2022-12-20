import { BaseSyntheticEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  checkAppletNameInLibraryApi,
  changeAppletNameApi,
  publishAppletToLibraryApi,
  getAppletLibraryUrlApi,
  updateAppletSearchTermsApi,
} from 'api';
import { folders } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { useAsync } from 'hooks/useAsync';
import { Modal } from 'components/Popups';
import { Spinner } from 'components/Spinner';
import { InputController, CheckboxController, TagsController } from 'components/FormComponents';
import { StyledErrorText } from 'styles/styledComponents/ErrorText';
import { StyledBodyMedium } from 'styles/styledComponents/Typography';

import { ShareAppletProps, ShareAppletData } from './ShareApplet.types';
import { StyledInputWrapper } from './ShareApplet.styles';
import { shareAppletDefaultValues } from './ShareApplet.const';
import { ShareAppletSchema } from './ShareApplet.schema';
import { getErrorComponent } from './ShareApplet.utils';
import { SuccessShared } from './SuccessShared';

export const ShareApplet = ({
  sharePopupVisible,
  setSharePopupVisible,
  applet,
}: ShareAppletProps) => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState(t('shareTheAppletWithTheLibrary'));
  const [secondBtnVisible, setSecondBtnVisible] = useState(false);
  const [showNameTakenError, setShowNameTakenError] = useState(false);
  const [appletShared, setAppletShared] = useState(false);
  const [appletUpdated, setAppletUpdated] = useState(false);
  const [libraryUrl, setLibraryUrl] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [removedFromLibrary, setRemovedFromLibrary] = useState(false);
  const [mainBtnText, setMainBtnText] = useState(t('share'));
  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, control, watch, setValue, getValues } = useForm<ShareAppletData>({
    resolver: yupResolver(ShareAppletSchema()),
    defaultValues: { ...shareAppletDefaultValues, appletName: applet?.name },
  });
  const checked = watch('checked');
  const { execute: handleCheckName, error: checkNameError } = useAsync(() =>
    checkAppletNameInLibraryApi({
      appletId: applet.id || '',
      appletName: getValues().appletName || '',
    }),
  );
  const { execute: handleChangeName, error: changeNameError } = useAsync(() =>
    changeAppletNameApi({
      appletId: applet.id || '',
      appletName: getValues().appletName || '',
    }),
  );

  const { execute: handlePublishApplet, error: publishError } = useAsync(() =>
    publishAppletToLibraryApi({
      appletId: applet.id || '',
    }),
  );

  const { execute: handleStopPublishApplet, error: publishStopError } = useAsync(() =>
    publishAppletToLibraryApi({
      appletId: applet.id || '',
      publish: false,
    }),
  );

  const { execute: getAppletLibUrl, error: getLibraryUrlError } = useAsync(() =>
    getAppletLibraryUrlApi({
      appletId: applet.id || '',
    }),
  );

  const { execute: handleUpdateSearchTerms, error: updateTermsError } = useAsync(() =>
    updateAppletSearchTermsApi({
      appletId: applet.id || '',
      params: { keywords: JSON.stringify(keywords) },
    }),
  );

  const handleModalClose = () => setSharePopupVisible(false);
  const handleShareApplet = async () => {
    const checkResult = await handleCheckName();
    if (checkResult.status === 200) {
      setShowNameTakenError(!checkResult.data);

      if (checkResult.data) {
        setIsLoading(true);
        const changeNameResult = await handleChangeName();

        if (changeNameResult.status === 200) {
          const publishResult = await handlePublishApplet();

          if (publishResult.status === 200) {
            const libraryUrlResult = await getAppletLibUrl();
            const updateTermsResult = await handleUpdateSearchTerms();

            if (libraryUrlResult.status === 200 && updateTermsResult.status === 200) {
              setLibraryUrl(libraryUrlResult.data || '');
              setIsLoading(false);
              setAppletShared(true);

              dispatch(
                folders.actions.updateAppletData({
                  appletId: applet.id,
                  published: true,
                  appletName: getValues().appletName,
                }),
              );
            }
          }
        }
      }
    }
  };

  const handleStopSharing = async () => {
    const publishStopResult = await handleStopPublishApplet();
    if (publishStopResult.status === 200) {
      setRemovedFromLibrary(true);
      setSecondBtnVisible(false);
      setMainBtnText(t('ok'));
      setTitle(t('appletIsRemovedFromLibrary'));

      dispatch(
        folders.actions.updateAppletData({
          appletId: applet.id,
          published: false,
        }),
      );
    }
  };

  const handleUpdateSharedApplet = async () => {
    setIsLoading(true);
    const changeNameResult = await handleChangeName();
    const updateTermsResult = await handleUpdateSearchTerms();
    const libraryUrlResult = await getAppletLibUrl();

    if (
      changeNameResult.status === 200 &&
      updateTermsResult.status === 200 &&
      libraryUrlResult.status === 200
    ) {
      setIsLoading(false);
      setLibraryUrl(libraryUrlResult.data || '');
      setAppletUpdated(true);

      dispatch(
        folders.actions.updateAppletData({
          appletId: applet.id,
          appletName: getValues().appletName,
          published: true,
        }),
      );
    }
  };

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

  const hasError =
    checkNameError || changeNameError || publishError || getLibraryUrlError || updateTermsError;

  hasError && setIsLoading(false);

  useEffect(() => {
    if (applet.published && !removedFromLibrary) {
      (async () => {
        const { getAppletSearchTerms } = folders.thunk;
        const result = await dispatch(getAppletSearchTerms({ appletId: applet.id }));

        if (getAppletSearchTerms.fulfilled.match(result)) {
          setKeywords(result.payload.data.keywords);
        }
      })();

      setTitle(t('updateSharedApplet'));
      setMainBtnText(t('stopSharing'));
      setSecondBtnVisible(true);
    }

    if (appletShared) {
      setTitle(t('appletIsSharedWithLibrary'));
      setSecondBtnVisible(false);
      setMainBtnText(t('ok'));
    }

    if (appletUpdated) {
      setTitle(t('appletIsUpdatedSuccessfully'));
      setSecondBtnVisible(false);
      setMainBtnText(t('ok'));
    }
  }, [applet, appletShared, appletUpdated, removedFromLibrary, dispatch, t]);

  let modalComponent: JSX.Element | null = (
    <>
      {isLoading && <Spinner />}
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
      {hasError && (
        <StyledInputWrapper>
          {checkNameError && getErrorComponent(checkNameError)}
          {changeNameError && getErrorComponent(changeNameError)}
          {publishError && getErrorComponent(publishError)}
          {getLibraryUrlError && getErrorComponent(getLibraryUrlError)}
          {updateTermsError && getErrorComponent(updateTermsError)}
          {publishStopError && getErrorComponent(publishStopError)}
        </StyledInputWrapper>
      )}
    </>
  );

  let mainBtnSubmit: ((e?: BaseSyntheticEvent | undefined) => Promise<void>) | (() => void) =
    handleSubmit(handleShareApplet);

  if (appletShared) {
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
    mainBtnSubmit = handleModalClose;
  } else if (removedFromLibrary) {
    modalComponent = null;
    mainBtnSubmit = handleModalClose;
  } else if (secondBtnVisible) {
    mainBtnSubmit = handleSubmit(handleStopSharing);
  } else if (appletUpdated) {
    modalComponent = (
      <SuccessShared
        title={getValues().appletName || applet.name || ''}
        text={applet.description || ''}
        keywords={keywords}
        appletLink={libraryUrl}
        img={applet.image || ''}
      />
    );
    mainBtnSubmit = handleModalClose;
  }

  return (
    <Modal
      open={sharePopupVisible}
      onClose={handleModalClose}
      onSubmit={mainBtnSubmit}
      title={title || ''}
      buttonText={mainBtnText || ''}
      disabledSubmit={!checked}
      width="60"
      hasSecondBtn={secondBtnVisible}
      secondBtnText={t('updateInTheLibrary')}
      onSecondBtnSubmit={handleSubmit(handleUpdateSharedApplet)}
      disabledSecondBtn={!checked}
    >
      {modalComponent}
    </Modal>
  );
};
