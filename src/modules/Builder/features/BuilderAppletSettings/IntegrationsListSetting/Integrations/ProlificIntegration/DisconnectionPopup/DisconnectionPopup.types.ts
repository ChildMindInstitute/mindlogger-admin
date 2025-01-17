export type DisconnectionPopupState =
  | {
      kind: 'idle';
    }
  | {
      kind: 'deleting';
    }
  | {
      kind: 'error';
      message: string;
    };
