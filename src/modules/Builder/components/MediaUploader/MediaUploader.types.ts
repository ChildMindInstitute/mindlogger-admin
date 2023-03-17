export type MediaUploaderProps = {
  width: number;
  height: number;
  resourceData: ResourceDataType | null;
  setResourceData: (data: ResourceDataType | null) => void;
};

export type ResourceDataType = {
  name: string;
  url: string;
  uploaded: boolean;
};

export type MediaUploaderHookProps = {
  setResourceData: (data: ResourceDataType | null) => void;
};
