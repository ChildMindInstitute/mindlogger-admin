export type EventAction = {};

export type EventKind = {};

export type EventOutcome = {};

export type ExportAuditLogsResult = {
  auditEvents: AuditEvent[];
};

export type AuditEvent = {
  timestamp: string;
  errorType: string;
  eventAction: EventAction;
  eventId: string;
  eventKind: EventKind;
  eventOutcome: EventOutcome;
  eventModule: string;
  eventDataSet: string;
  serviceName: string;
  serviceEnvironment: string;
  userId: string;
  userRoles: string[];
  userTargetId: string;
  userTargetEmail: string;
  userTargetRoles: string[];
  clientIp: string;
  httpRequestId: string;
  httpRequestMethod: string;
  httpResponseStatusCode: number;
  traceId: string;
  urlPath: string;
  urlQuery: string;
  userAgent: string;
  filePath: string;
  curiousAppletId: string[];
  curiousSubjectId: string[];
  curiousFlowId: string[];
  curiousActivityId: string[];
  curiousSubmitId: string[];
  curiousAnswerId: string[];
  eventCategory: string[];
  eventType: string;
};
