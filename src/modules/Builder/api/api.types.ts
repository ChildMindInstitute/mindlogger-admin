export type GetThemesParams = {
  search?: string;
  page?: number;
  limit?: number;
  ordering?: string;
  public?: boolean;
  allowRename?: boolean;
  creatorId?: string;
};

export type Theme = {
  name: string;
  logo: string;
  backgroundImage: string;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  id: string;
  public: boolean;
  allowRename: boolean;
};

export type Themes = Theme[];
