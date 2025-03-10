/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly REACT_APP_DD_CLIENT_TOKEN: string;
  readonly REACT_APP_DD_APP_ID: string;
  readonly REACT_APP_ENV: string;
  readonly REACT_APP_DD_VERSION: string;
  readonly REACT_APP_DD_TRACING_URLS: string;
  readonly REACT_APP_DSN: string;
  readonly REACT_APP_TRACE_PROPAGATION_TARGETS: string;
  readonly REACT_APP_LAUNCHDARKLY_CLIENT_ID: string;
  readonly REACT_APP_API_DOMAIN: string;
  readonly REACT_APP_MIXPANEL_TOKEN: string;
  readonly REACT_APP_WEB_URI: string;
  readonly REACT_APP_MIXPANEL_FORCE_ENABLE: string;
  readonly REACT_APP_DEVELOP_BUILD_VERSION: string;

  // Add other environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
